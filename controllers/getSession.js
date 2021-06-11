require("dotenv").config();
const logger = require("./logger");

const fs = require("fs");
const dateFormat = require("dateformat");
const soap = require("soap");
const moment = require("moment");
const url = process.env.SOAP_WS_SESSION_URL;

async function getSession(req, res) {
  console.log("Enter session controller");
  console.log(">> Request: " + req.query);
  const data = req.query;
  console.log("Data received from request: ", data);

  var dateFile = dateFormat(new Date(), "yyyy-mm-dd");
  const file = `/tmp/session_${dateFile}.dat`;
  const sessaoMaster = process.env.SESSION_MASTER;

  if (fs.existsSync(file)) {
    let buf = fs.readFileSync(file);
    return buf.toString();
  }

  const dateStr = moment().format();
  var args = {
    SeuSistema: data.SeuSistema || "URA03186919001U",
    NrLocal: data.NrLocal || 1,
    HoraLocal: dateStr,
    Sessao: data.Sessao || sessaoMaster,
    NrCentral: 0,
    HoraCentral: dateStr,
    CtlAP: "AP00",
    VersaoTabela: data.VersaoTabela || 1,
    VersaoInterface: data.VersaoInterface || 1,
  };
  logger.info("Result from SOAP WS: ", args);

  // get Session from SOAP Service
  let LogOnResult = await new Promise((resolve, reject) => {
    console.log("passo 1");
    soap.createClient(url, function (err, client) {
      console.log("passo 2");
      client.LogOn(args, function (err, result) {
        console.log("passo 3");
        if (err) {
          logger.info("ERRO SOAP", err);
          reject(err);
        }
        logger.info("Result from SOAP WS", result);
        //console.log("Result from SOAP WS", result);
        resolve(result);
      });
    });
  });

  let session = LogOnResult.LogOnResult.Sessao;
  fs.writeFileSync(file, session);

  console.log("Session from SOAP ", session);
  return session;
}

module.exports = getSession;
