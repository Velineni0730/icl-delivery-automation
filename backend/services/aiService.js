const fs = require("fs");
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function extractDeliverySheet(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",

    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
Extract ONLY the following from this courier delivery sheet.

For the sheet:
- Runsheet Date

For every shipment row:
- AWB Number
- Pieces
- Charge Weight

Ignore everything else:
Customer Name, Address, Phone, Receiver, Signature, OTP,
Route, Origin, Destination, COD, Remarks.

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

          rows: {
            type: Type.ARRAY,

            items: {
              type: Type.OBJECT,

              properties: {
                awb: {
                  type: Type.STRING,
                },

                pieces: {
                  type: Type.INTEGER,
                },

                weight: {
                  type: Type.NUMBER,
                },
              },

              required: ["awb", "pieces", "weight"],
            },
          },
        },

        required: ["date", "rows"],
      },
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  extractDeliverySheet,
};