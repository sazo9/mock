const fs = require("fs");
const dateFormat = require("dateformat");

async function getProtocol(req, res) {
  var dateFile = dateFormat(new Date(), "yyyy-mm-dd");
  const file = `/tmp/protocol_${dateFile}.dat`;

  let sequence = 000000001;
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, sequence);
    return sequence;
  }

  let buf = fs.readFileSync(file);
  sequence = Number(buf.toString()) + 1;
  fs.writeFileSync(file, sequence);
  return sequence;
}

module.exports = getProtocol;
