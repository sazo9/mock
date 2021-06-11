const bodyParser = require("body-parser");
const express = require("express");
const logger = require("./controllers/logger");
const httpLogger = require("./controllers/httpLogger");

const getSession = require("./controllers/getSession");
const getProtocol = require("./controllers/getProtocol");

const app = express();
app.use(httpLogger);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//digito invalido = /Sazonov/InvalidResponse_BrPrt.wav
//check de digitos
//execesso de tentativas

//STEP
//100 = SAUDACAO
//101 = VERBALIZA ANI - O NUMERO É O MESMO DO SEU CADASTRO? DIGITE 1 PARA SIM OU 2 PARA NÃO
//    CHECK DIGITS
//103 = COLETA CPF (CLIENTE)
//104 = CONFIRMA CPF - 1 PARA SIM 2 PARA NAO
//    CHECK DIGITS
//105 = TRANSFERE

//103 = MENU 2 OPCOES - 2 CLIENTE 3 NAO CLIENTE

app.get("/step/:id", async (req, res) => {
  try {
    switch (req.params.id) {
      case "100":
        res.status(200).json(step100());
        break;
      case "103":
        res.status(200).json(step103());
        break;
      case "104":
        res.status(200).json(step104());
        break;
      case "105":
        res.status(200).json(step105());
        break;
      case "106":
        res.status(200).json(step106());
        break;
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.get("/step/:id/:capture", async (req, res) => {
  try {
    switch (req.params.id) {
      case "101":
        res.status(200).json(step101(req.params.capture));
        break;

      case "701":
        if (req.params.capture == 1) {
          res.status(200).json(step105());
        } else if (req.params.capture == 2) {
          res.status(200).json(step103());
        } else {
          //digito invalido
        }
        break;

      case "703":
        if (req.params.capture.length == 11) {
          res.status(200).json(step104(req.params.capture));
        } else {
          //digito invalido
          res.status(200).json(step106("103"));
        }
        break;

      case "704":
        if (req.params.capture == 2) {
          res.status(200).json(step105());
        } else if (req.params.capture == 3) {
          res.status(200).json(step103());
        } else {
          //digito invalido
          res.status(200).json(step106("103"));
        }
        break;
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

function step100() {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      step: 101,
      action: "PLAY",
      vox: {
        default: "100.wav",
        error: "",
        tts: "BEM VINDO",
      },
      qtdDigits: 0,
      mask: "",
      maxTry: 0,
      transfer: {
        error: "2904",
        default: "2904",
      },
    },
  };
}

function step101(ani) {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      nextstep: 701,
      action: "PLAY",
      vox: {
        default: "101A.wav; 101B.wav",
        error: "",
        tts:
          "O NUMERO " +
          ani +
          " É O MESMO DO SEU CADASTRO? DIGITE 1 PARA SIM OU 2 PARA NÃO",
      },
      qtdDigits: 11,
      mask: "%",
      maxTry: 0,
      transfer: {
        error: "2904",
        default: "2904",
      },
    },
  };
}

function step103() {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      nextstep: 703,
      action: "PLAY",
      vox: {
        default: "103.wav",
        error: "",
        tts: "AGORA DIGITE SEU CPF",
      },
      qtdDigits: 11,
      mask: "%",
      maxTry: 0,
      transfer: {
        error: "2904",
        default: "2904",
      },
    },
  };
}

function step104(cpf) {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      nextstep: 704,
      action: "PLAY",
      vox: {
        default: "104.wav",
        error: "",
        tts:
          "O CPF " +
          cpf +
          " ESTÁ CORRETO? SE SIM DIGITE 2 OU DIGITE 3 PARA NAO",
      },
      qtdDigits: 1,
      mask: "2;3",
      maxTry: 0,
      transfer: {
        error: "2904",
        default: "2904",
      },
    },
  };
}

function step105() {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      nextstep: "",
      action: "TRANSFER",
      vox: {
        default: "105.wav",
        error: "",
        tts: "AGUARDE ENQUANTO EU TE TRANSFIRO",
      },
      qtdDigits: 0,
      mask: "",
      maxTry: 0,
      transfer: {
        error: "2904",
        default: "2904",
      },
    },
  };
}

function step106(nextstep) {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      nextstep: nextstep,
      action: "PLAY",
      vox: {
        default: "/Sazonov/InvalidResponse_BrPrt.wav",
        error: "",
        tts: "",
      },
      qtdDigits: 0,
      mask: "",
      maxTry: 0,
      transfer: {
        error: "2904",
        default: "2904",
      },
    },
  };
}
// get a new session
app.get("/session", async (req, res) => {
  try {
    console.log("Executing GET session API");
    logger.request(req, res);
    let session = await getSession(req, res);
    console.log("Result from GET session API", session);
    logger.info("[SessionID] %s", session);
    logger.info("[Route] %s", req.route);
    logger.info("[Header] %s", req.headers);
    //logger.info("Request Query Params:", req.query); // for all query params
    //logger.info("Request Path:", req.path);

    res.status(200).json({ data: session } || []);
  } catch (e) {
    logger.error("error: ", e);
    res.status(500).send({ error: e.message });
  }
});

// get a new protocol
app.get("/protocol", async (req, res) => {
  try {
    console.log("Executing GET protocol API");
    let protocol = await getProtocol(req, res);
    console.log("Result from GET protocol API", protocol);
    res.status(200).json({ data: protocol } || []);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// get test info
app.get("/echo", (req, res) => {
  console.log("Executing GET echo API");
  let response = req.query;
  if (!response || Object.keys(response).length === 0) response = req.body;
  console.log("Result from GET echo API", response);
  res.status(200).json({ response } || []);
});

app.use(logErrors);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function errorHandler(err, req, res, next) {
  res.status(500).send("Error!");
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
