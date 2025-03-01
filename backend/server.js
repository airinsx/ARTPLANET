const express = require("express");
const bodyParser = require("body-parser");
const xml2js = require("xml2js");
const usersRoutes = require("./routes/users");

const app = express();
app.use(bodyParser.text({ type: "text/xml" }));

// Serve crossdomain.xml
app.get("/crossdomain.xml", (req, res) => {
    const crossdomainXML = `<?xml version="1.0"?>
    <!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">
    <cross-domain-policy>
     <script/>
<site-control permitted-cross-domain-policies="all"/>
<allow-access-from domain="*" to-ports="*" secure="false"/>
<allow-http-request-headers-from domain="*" headers="*" secure="false"/>
    </cross-domain-policy>`;
  
    res.set("Content-Type", "text/xml");
    res.send(crossdomainXML);
  });  

// Handle all SOAP requests
app.post("/Service", usersRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`SOAP API running on port ${PORT}`));
