const mongoose = require("mongoose");

const dbConnect = async () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      console.log(
        "==============Mongodb Database Connected Successfully=============="
      )
    )
    .catch((err) => console.log("Database Not Connected !!!", err));
};

module.exports = dbConnect;
