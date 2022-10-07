let express = require('express');
let app = express();

const PORT = 9999;

  app.use(express.static('public'))

app.listen(PORT, console.log("Listening"));