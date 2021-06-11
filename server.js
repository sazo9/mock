const bodyParser = require("body-parser");
const express = require("express");

const app = express();
//app.use(httpLogger);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//STEP
//100 = SAUDACAO
//101 = MENU 2 OPCOES - 2 CLIENTE 3 NAO CLIENTE
//102 = COLETA CPF (CLIENTE)
//103 = TRANSFERE

app.get("/step/:id", async (req, res) => {
  try {
    switch (req.params.id) {
      case "100":
        res.status(200).json(step100());
        break;
      case "101":
        res.status(200).json(step101());
        break;
      case "102":
        res.status(200).json(step102());
        break;
      case "103":
        res.status(200).json(step103());
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
      vox_default: "100.wav",
      vox_error: "",
      vox_tts: "bem vindo",
      qtdDigits: 0,
      mask: "",
      maxTry: 0,
      vdnError: "2904",
      vdn: "",
    },
  };
}

function step101() {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      step: 102,
      action: "PLAY",
      vox_default: "101.wav",
      vox_error: "",
      vox_tts: "se voce já é cliente, digite 2, se não é digite 3",
      qtdDigits: 1,
      mask: "2;3",
      maxTry: 0,
      vdnError: "2904",
      vdn: "2904",
    },
  };
}

function step102() {
  return {
    data: {
      retCode: "N000",
      description: "N000 - Transacao Aprovada",
      session:
        "6CB8BFFBC966072E22FAF4C5DC19528FBFBC6D16DD2A800673079FAC893093E1BAF282E757CB083B1A",
      step: 103,
      action: "PLAY",
      vox_default: "102.wav",
      vox_error: "",
      vox_tts: "agora digite seu cpf",
      qtdDigits: 11,
      mask: "%",
      maxTry: 0,
      vdnError: "2904",
      vdn: "2904",
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
      step: 104,
      action: "TRANSF",
      vox_default: "",
      vox_error: "",
      vox_tts: "",
      qtdDigits: 0,
      mask: "",
      maxTry: 0,
      vdnError: "2904",
      vdn: "2904",
    },
  };
}

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
