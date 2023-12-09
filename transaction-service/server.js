const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const scheduledFunctions = require("./services/ScheduledFn");
require("dotenv").config();

//Init Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Start cron job
// scheduledFunctions.initScheduledJobs();

const status = require("./routes/api/status");

app.use("/api/v1/", status);

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
