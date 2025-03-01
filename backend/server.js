const express = require("express");
const bodyParser = require("body-parser");
const xml2js = require("xml2js");
const usersRoutes = require("./routes/users");

const app = express();
app.use(bodyParser.text({ type: "text/xml" }));

// Handle all SOAP requests
app.post("/Service", usersRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`SOAP API running on port ${PORT}`));
