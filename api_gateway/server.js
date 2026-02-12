const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const router = express.Router();

dotenv.config();

const app = express();

app.use(express.json());

// CORS middleware first
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

// Add required header for Chrome’s new Private Network policy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', 'true');
  next();
});

// Handle preflight explicitly
app.options(/.*/, (req, res) => {
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Private-Network', 'true');
  res.sendStatus(204);
});

// Your routes:
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.use(router);
app.use("/api/physio", require("./routes/physioRoutes"));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));