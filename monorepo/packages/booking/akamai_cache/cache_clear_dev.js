const EdgeGrid = require("akamai-edgegrid");
const os = require("os");
const edgercPath = os.homedir + "/.edgerc.txt";
const edgercSection = "ccu";
const eg = new EdgeGrid({
    path: edgercPath,
    section: edgercSection
});

const network = "production";

eg.auth({
    path: `/ccu/v3/invalidate/cpcode/${network}`,
    method: "POST",
    headers: {
        "Content-Type": "application/json",

        "Accept": "application/json"
    },
    body: {
        "objects": [
            1406463
        ]
    }
});
eg.send(function (error, response, body) {
    console.log(body);
});