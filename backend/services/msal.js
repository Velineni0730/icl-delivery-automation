const { ConfidentialClientApplication } = require("@azure/msal-node");

const msalConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        clientSecret: process.env.AZURE_CLIENT_SECRET,
    },
};

const cca = new ConfidentialClientApplication(msalConfig);

module.exports = cca;