const xml2js = require("xml2js");

const builder = new xml2js.Builder();

// Convert XML string to JSON
function parseXML(xmlString) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlString, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// Convert JSON to XML string
function buildXML(jsonData) {
  return builder.buildObject(jsonData);
}

module.exports = { parseXML, buildXML };
