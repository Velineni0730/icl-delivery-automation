const getGraphClient = require("./graphClient");

async function appendShipments(accessToken, shipments, sheetDate) {
    const graph = getGraphClient(accessToken);

    const rootItems = await graph.api("/me/drive/root/children").get();

    const domesticFolder = rootItems.value.find(
        item => item.name === "DOMESTIC" && item.folder
    );

    if (!domesticFolder) {
        throw new Error("DOMESTIC folder not found");
    }

    const [day, monthNum, year] = sheetDate.split("-");

const months = [
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

const month = months[Number(monthNum) - 1];

    const workbookName = `RISE INTERNATIONAL ${month.toUpperCase()} ${year}.xlsx`;

    const files = await graph
        .api(`/me/drive/items/${domesticFolder.id}/children`)
        .get();

    const workbook = files.value.find(
        f => f.name.toLowerCase() === workbookName.toLowerCase()
    );

    if (!workbook)
        throw new Error(`${workbookName} not found`);

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

const range = await graph
    .api(
        `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='A13:F1000')`
    )
    .get();

    const values = range.values || [];

    let firstEmptyRow = 13;

    for (let i = 0; i < values.length; i++) {
        const row = values[i];

        if (!row || row.every(c => c === "" || c == null)) {
            firstEmptyRow = i + 13;
            break;
        }
    }

    const excelRows = shipments.map((s, index) => [
        firstEmptyRow + index - 12,
        sheetDate,
        s.awb,
        s.pieces,
        s.weight,
        s.amount
    ]);

    await graph
        .api(
            `/me/drive/items/${workbook.id}/workbook/worksheets('${worksheet.name}')/range(address='A${firstEmptyRow}:F${firstEmptyRow + excelRows.length - 1}')`
        )
        .patch({
            values: excelRows,
        });

    return true;
}

module.exports = { appendShipments };