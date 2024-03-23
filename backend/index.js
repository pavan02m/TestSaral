const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const dbConnect = require("./config/db");
const userRoute = require("./routes/user.routes");

dbConnect();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/", userRoute);

app.get("/", (req, res) => {
  res.send("this is home page");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
