const express = require("express");
const {
  getUsers,
  getSurveyResponses,
  getCancelledData,
  getRatnadata,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/user", getUsers);
router.get("/survey-responses", getSurveyResponses);
router.get("/cancelled-data", getCancelledData);

module.exports = router;
