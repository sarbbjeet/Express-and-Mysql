const fs = require("fs");
const http = require("http");
const https = require("https");
const app = require("express")();
const { http_port, https_port } = require("../config/default");
///////////////////////////////
//get port numbers
const httpPort = http_port || 3000;
const httpsPort = https_port || 4000;

//add credentials for https server
// const privateKey = fs
//   .readFileSync(require("../certificates/ca-key.pem"), "utf-8")
//   .toString();
// const cert = fs.readFileSync(require("../certificates/ca-cert.pem"), "utf8");
// const credentials = { key: privateKey, cert };

//create http and https Server
const httpServer = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);

//create http and https listener server
httpServer.listen(httpPort, () =>
  console.log(`http serve listening on ${httpPort}`)
);
// httpsServer.listen(httpsPort, () =>
//   console.log(`https server listening on ${httpsPort}`)
// );

module.exports = app;
