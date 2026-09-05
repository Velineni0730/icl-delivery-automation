const fs = require("fs");
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function extractDeliverySheet(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
Extract the delivery run sheet into structured JSON.

For the sheet:
- Runsheet Date
- Delivery Staff name

For every shipment row (maximum 8):
- S.No.
- AWB Number
- Pieces (Pcs)
- Charge Weight (Wt)

For Delivery Details ONLY:
- Phone number: extract only a clearly visible 10-digit number, otherwise null.
- Sign: if a signature is present, return the clearly readable person's name; otherwise "sign"; if no signature, null.
- Stamp: true if an official stamp is visible, otherwise false.

Ignore Origin and Consignee Address completely for receiver/sign/stamp/phone detection.
Ignore the printed Runsheet Number.

Do not guess unclear information.

Return only the extracted data.
`,
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBuffer.toString("base64"),
            },
          },
        ],
      },
    ],

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: Type.OBJECT,

        properties: {
          date: {
            type: Type.STRING,
          },

          deliveryStaff: {
            type: Type.STRING,
          },

          rows: {
            type: Type.ARRAY,
            maxItems: 8,

            items: {
              type: Type.OBJECT,

              properties: {
                serialNumber: {
                  type: Type.INTEGER,
                },

                awb: {
                  type: Type.STRING,
                },

                pieces: {
                  type: Type.INTEGER,
                },

                weight: {
                  type: Type.NUMBER,
                },

                deliveryDetails: {
                  type: Type.OBJECT,

                  properties: {
                    phone: {
                      type: Type.STRING,
                      nullable: true,
                    },

                    sign: {
                      type: Type.STRING,
                      nullable: true,
                    },

                    stamp: {
                      type: Type.BOOLEAN,
                    },
                  },

                  required: ["phone", "sign", "stamp"],
                },
              },

              required: [
                "serialNumber",
                "awb",
                "pieces",
                "weight",
                "deliveryDetails",
              ],
            },
          },
        },

        required: ["date", "deliveryStaff", "rows"],
      },
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  extractDeliverySheet,
};