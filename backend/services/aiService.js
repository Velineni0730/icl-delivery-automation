const fs = require("fs");
const { GoogleGenAI, Type } = require("@google/genai");

const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
].filter(Boolean);

if (apiKeys.length === 0) {
  throw new Error("No Gemini API keys configured");
}

const clients = apiKeys.map(
  (key) => new GoogleGenAI({ apiKey: key })
);

const cooldownUntil = apiKeys.map(() => 0);

function isRateLimitError(err) {
  return (
    err?.status === 429 ||
    err?.code === 429 ||
    err?.status === "RESOURCE_EXHAUSTED" ||
    err?.error?.status === "RESOURCE_EXHAUSTED"
  );
}

function setCooldown(index, err) {
  const errorText = JSON.stringify(err).toLowerCase();

  if (
    errorText.includes("per day") ||
    errorText.includes("daily") ||
    errorText.includes("rpd")
  ) {
    cooldownUntil[index] = Date.now() + 24 * 60 * 60 * 1000;
    return;
  }

  cooldownUntil[index] = Date.now() + 60 * 1000;
}

async function extractDeliverySheet(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  let lastRateLimitError = null;

  for (let i = 0; i < clients.length; i++) {
    if (Date.now() < cooldownUntil[i]) {
      continue;
    }

    try {
      console.log(`Using Gemini API key ${i + 1}`);

      const response = await clients[i].models.generateContent({
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

    } catch (err) {
      console.error(`Gemini API key ${i + 1} failed:`, err.message);

      if (!isRateLimitError(err)) {
        throw err;
      }

      lastRateLimitError = err;

      setCooldown(i, err);

      console.log(`Gemini API key ${i + 1} is on cooldown.`);
      console.log("Trying next API key...");
    }
  }

  throw lastRateLimitError;
}

module.exports = {
  extractDeliverySheet,
};