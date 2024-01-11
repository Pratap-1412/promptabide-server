const express = require("express");
const cors = require('cors');
require("./database/Configure");
const app = express();
app.use(express.json());
app.use(cors());
const Routes = require('./routes/route')

const PORT = process.env.PORT || 5000;

app.use('/', Routes);

app.listen(PORT, () => console.log(`Server is running successfully on PORT: ${PORT}`));
// console.log(`URL: http://localhost:${PORT}`)