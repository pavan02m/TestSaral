const RelationshipHistory = require("../models/relationshiphistories.model");
const Survey = require("../models/survey.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const email = req.query.email || "";
    const status = req.query.status || "All";
    const fromDate = req.query.fromDate || "";
    const toDate = req.query.toDate || "";

    let users;

    if (fromDate || toDate) {
      users = await User.find({
        $and: [
          { created_at: { $gte: new Date(fromDate), $lt: new Date(toDate) } },
          { email: { $regex: email, $options: "i" } },
          { subscriptionStatus: status },
        ],
      })
        .skip(page * limit)
        .limit(limit)
        .sort({ cancelledAt: -1 });
    } else if (status === "All") {
      users = await User.find({
        email: { $regex: email, $options: "i" },
      })
        .skip(page * limit)
        .limit(limit)
        .sort({ cancelledAt: -1 });
    } else if (status !== "All") {
      users = await User.find({
        $and: [
          { email: { $regex: email, $options: "i" } },
          { subscriptionStatus: status },
        ],
      })
        .skip(page * limit)
        .limit(limit)
        .sort({ cancelledAt: -1 });
    }
    let total;

    if (status == "All") {
      total = await User.countDocuments({
        email: { $regex: email, $options: "i" },
      });
    } else {
      total = await User.countDocuments({
        $and: [
          { email: { $regex: email, $options: "i" } },
          { subscriptionStatus: status },
        ],
      });
    }

    if (!users || users.length == 0) {
      return res.status(404).json({ message: "no user found" });
    }

    let cntArray = [];

    for (let i = 0; i < users.length; i++) {
      let cnt = await RelationshipHistory.aggregate([
        {
          $match: {
            // userId: new mongoose.Types.ObjectId("634e6ef5d4625df896efa0fa"),
            userId: users[i]._id,
          },
        },
        {
          $group: {
            _id: users[i]._id,
            onboardedCount: {
              $sum: { $cond: [{ $eq: ["$toColumn", "onboarded"] }, 1, 0] },
            },
            reachedOutCount: {
              $sum: { $cond: [{ $eq: ["$toColumn", "reached out"] }, 1, 0] },
            },
            prospectsCount: {
              $sum: { $cond: [{ $eq: ["$toColumn", "prospects"] }, 1, 0] },
            },
            inconversationCount: {
              $sum: {
                $cond: [{ $eq: ["$toColumn", "in conversation"] }, 1, 0],
              },
            },
            rejectedCount: {
              $sum: { $cond: [{ $eq: ["$toColumn", "rejected"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            userId: "$_id",
            _id: 0,
            onboardedCount: 1,
            prospectsCount: 1,
            inConversationCount: 1,
            rejectedCount: 1,
          },
        },
      ]);

      if (cnt.length === 1) {
        cntArray.push(cnt[0]);
      } else {
        cntArray.push({
          userId: users[i]._id,
          onboardedCount: 0,
          prospectsCount: 0,
          inConversationCount: 0,
          rejectedCount: 0,
        });
      }
    }

    res.status(200).json({
      total,
      page: page + 1,
      limit,
      users,
      cntArray,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server error");
  }
};

const getSurveyResponses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const id = req.query.id || "";
    const fromDate = req.query.fromDate || "";
    const toDate = req.query.toDate || "";
    let responses;

    if ((id === "" && fromDate) || toDate) {
      responses = await Survey.find({
        createdAt: {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        },
      })
        .skip(page * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: "userId",
        })
        .exec();

      let total = await Survey.countDocuments({});

      res.status(200).json({
        total,
        page: page + 1,
        limit,
        responses,
      });
    } else if (id) {
      responses = await Survey.find({ _id: id })
        .populate({
          path: "userId",
        })
        .exec();

      let total = await Survey.countDocuments({});

      res.status(200).json({
        total,
        page: page + 1,
        limit,
        responses,
      });
    } else if (id === "") {
      responses = await Survey.find({})
        .skip(page * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate({
          path: "userId",
        })
        .exec();

      let total = await Survey.countDocuments({});

      res.status(200).json({
        total,
        page: page + 1,
        limit,
        responses,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getCancelledData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10;
    const email = req.query.email || "";
    const status = req.query.status || "cancelled";
    // const date = req.quer.date_range || "";

    let users;

    if (email === "" || status === "") {
      users = await User.find({ subscriptionStatus: "cancelled" })
        .skip(page * limit)
        .sort({ cancelledAt: -1 })
        .limit(limit);
    } else {
      users = await User.find({
        $and: [
          { email: { $regex: email, $options: "i" } },
          { subscriptionStatus: status },
        ],
      })
        .skip(page * limit)
        .sort({ cancelledAt: -1 })
        .limit(limit);
    }

    let total;
    total = await User.countDocuments({
      $and: [{ subscriptionStatus: status }],
    });

    if (!users || users.length == 0) {
      return res.status(404).json({ message: "no user found" });
    }

    res.status(200).json({
      total,
      page: page + 1,
      limit,
      users,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getUsers,
  getSurveyResponses,
  getCancelledData,
};
