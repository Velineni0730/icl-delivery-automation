require("isomorphic-fetch");

const { Client } = require("@microsoft/microsoft-graph-client");

function getGraphClient(accessToken) {
    return Client.init({
        authProvider: (done) => {
            done(null, accessToken);
        },
    });
}

module.exports = getGraphClient;