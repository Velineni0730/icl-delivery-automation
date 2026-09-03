const getGraphClient = require("./graphClient");

const MONTHS = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];

const DATA_START_ROW = 13;

function getMonthInfo(sheetDate) {
    const [day, monthNum, year] = sheetDate.split("-");

    const month = MONTHS[Number(monthNum) - 1];

    if (!month || !day || !year) {
        throw new Error(`Invalid sheet date: ${sheetDate}`);
    }

    return {
        day,
        monthNum,
        year,
        month,
        workbookName: `RISE INTERNATIONAL ${month.toUpperCase()} ${year}.xlsx`,
    };
}

async function getWorkbookAndWorksheet(graph, sheetDate) {
    const { month, workbookName } = getMonthInfo(sheetDate);

    const rootItems = await graph
        .api("/me/drive/root/children")
        .get();

    const domesticFolder = rootItems.value.find(
        item => item.name === "DOMESTIC" && item.folder
    );

    if (!domesticFolder) {
        throw new Error("DOMESTIC folder not found");
    }

    const files = await graph
        .api(`/me/drive/items/${domesticFolder.id}/children`)
        .get();

    const workbook = files.value.find(
        f => f.name.toLowerCase() === workbookName.toLowerCase()
    );

    if (!workbook) {
        throw new Error(`${workbookName} not found`);
    }

    const worksheets = await graph
        .api(`/me/drive/items/${workbook.id}/workbook/worksheets`)
        .get();

    const worksheet = worksheets.value.find(
        ws => ws.name.toLowerCase() === month.toLowerCase()
    );

    if (!worksheet) {
        throw new Error(
            `Worksheet ${month.toUpperCase()} not found in ${workbookName}`
        );
    }

    return {
        workbook,
        worksheet,
        month,
        workbookName,
    };
}

function parseDate(value) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value === "number") {
        return new Date(
            Date.UTC(1899, 11, 30) + value * 86400000
        );
    }

    const text = String(value).trim();

    const parts = text.split(/[/-]/);

    if (parts.length !== 3) {
        return null;
    }

    let day;
    let month;
    let year;

    if (parts[0].length <= 2 && parts[1].length <= 2) {
        day = Number(parts[0]);
        month = Number(parts[1]);
        year = Number(parts[2]);
    } else {
        return null;
    }

    if (
        !Number.isInteger(day) ||
        !Number.isInteger(month) ||
        !Number.isInteger(year)
    ) {
        return null;
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;
}

function dateToExcelSerial(date) {
    const utcDate = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    );

    const excelEpoch = Date.UTC(1899, 11, 30);

    return Math.round((utcDate - excelEpoch) / 86400000);
}

function dateToDisplay(date) {
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

async function findDuplicateAwbs(accessToken, shipments, sheetDate) {
    const graph = getGraphClient(accessToken);

    const {
        workbook,
        worksheet,
        workbookName,
    } = await getWorkbookAndWorksheet(graph, sheetDate);

    const range = await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='C13:C1000')`
        )
        .get();

    const existingAwbs = new Set(
        (range.values || [])
            .flat()
            .filter(value => value !== "" && value != null)
            .map(value => String(value).trim())
    );

    console.log("Checking workbook:", workbookName);
    console.log("Checking worksheet:", worksheet.name);
    console.log("Existing AWBs count:", existingAwbs.size);

    const uploadedAwbs = shipments.map(
        s => String(s.awb).trim()
    );

    console.log("Checking uploaded AWBs:", uploadedAwbs);

    const duplicates = uploadedAwbs.filter(
        awb => existingAwbs.has(awb)
    );

    console.log("Duplicate AWBs:", duplicates);

    return [...new Set(duplicates)];
}

async function appendShipments(accessToken, shipments, sheetDate) {
    const graph = getGraphClient(accessToken);

    const {
        workbook,
        worksheet,
        workbookName,
    } = await getWorkbookAndWorksheet(graph, sheetDate);

    const range = await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='A13:F1000')`
        )
        .get();

    const values = range.values || [];

    let lastDataRow = DATA_START_ROW - 1;

    for (let i = 0; i < values.length; i++) {
        const row = values[i] || [];

        const awb = row[2];

        if (awb !== "" && awb != null) {
            lastDataRow = DATA_START_ROW + i;
        }
    }

    console.log("Workbook:", workbookName);
    console.log("Worksheet:", worksheet.name);
    console.log("Last shipment row:", lastDataRow);

    const insertRow = lastDataRow + 1;
    const numberOfNewRows = shipments.length;

    await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='A${insertRow}:F${insertRow + numberOfNewRows - 1}')/insert`
        )
        .post({
            shift: "Down",
        });

    const parsedSheetDate = parseDate(sheetDate);

    if (!parsedSheetDate) {
        throw new Error(`Invalid sheet date: ${sheetDate}`);
    }

    const excelDate = dateToExcelSerial(parsedSheetDate);

    const newRows = shipments.map((s) => [
        0,
        excelDate,
        String(s.awb).trim(),
        Number(s.pieces),
        Number(s.weight),
        Number(s.amount),
    ]);

    await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='A${insertRow}:F${insertRow + numberOfNewRows - 1}')`
        )
        .patch({
            values: newRows,
        });

    const finalLastRow = lastDataRow + numberOfNewRows;

    await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='A${DATA_START_ROW}:F${finalLastRow}')/sort/apply`
        )
        .post({
            fields: [
                {
                    key: 1,
                    ascending: true,
                },
            ],
            hasHeaders: false,
            orientation: "Rows",
        });

    const serialNumbers = [];

    for (
        let rowNumber = DATA_START_ROW;
        rowNumber <= finalLastRow;
        rowNumber++
    ) {
        serialNumbers.push([rowNumber - DATA_START_ROW + 1]);
    }

    await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='A${DATA_START_ROW}:A${finalLastRow}')`
        )
        .patch({
            values: serialNumbers,
        });

    const dateFormats = [];

    for (
        let rowNumber = DATA_START_ROW;
        rowNumber <= finalLastRow;
        rowNumber++
    ) {
        dateFormats.push(["dd-mm-yyyy"]);
    }

    await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='B${DATA_START_ROW}:B${finalLastRow}')`
        )
        .patch({
            numberFormat: dateFormats,
        });

    console.log(
        `Added ${numberOfNewRows} shipment(s) and sorted by date.`
    );

    return true;
}

module.exports = {
    appendShipments,
    findDuplicateAwbs,
};