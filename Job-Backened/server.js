const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use("/api", require("./routes/api"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
