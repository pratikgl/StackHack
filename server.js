const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.get("/", (req, res) => res.send("API running"));

//Init Middleware body parser
app.use(express.json({ extended: false }));

//define route
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

const connectDB = require("./config/db");
connectDB();
