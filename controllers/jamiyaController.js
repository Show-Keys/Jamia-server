import jamiyaModel from '../models/jamiyaModel.js';
import userModel from '../models/UserModel.js';

export const getJamiyas = async (req, res) => {
  try {
    const jamiyas = await jamiyaModel.aggregate([{ $sort: { createdAt: -1 } }]);
    return res.status(200).json({ jamiya: jamiyas, message: "success" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const saveJamiya = async (req, res) => {
  try {
    const jamiya = await jamiyaModel.findOne({ jcode: req.body.jcode });
    if (jamiya) {
      res.send("Jamiya Exist");
    } else {
      const newjamiya = new jamiyaModel({
        jcode: req.body.jcode,
        name: req.body.name,
        picture: req.body.picture,
        description: req.body.description,
        noMonths: req.body.noMonths,
        startDay: req.body.startDay,
        endDate: req.body.endDate,
        totalShares: req.body.noMonths,
      });
      await newjamiya.save();
      res.send("Added..");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getJamiya = async (req, res) => {
  try {
    const Jamiya = await jamiyaModel.findOne({ jcode: req.body.jcode });
    if (!Jamiya) {
      return res.status(500).json({ message: "Jamiya not found.." });
    } else {
      return res.status(200).json({ jamiya: Jamiya, message: "success" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const addParticipant = async (req, res) => {
  const { jcode, userId, shares, shareNumbers } = req.body;

  try {
    const jamiya = await jamiyaModel.findOne({ jcode });

    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    if (shares > jamiya.totalShares) {
      return res.status(400).json({
        message: "Not enough shares available",
        totalShares: jamiya.totalShares,
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    jamiya.participants.push({ userId: user._id, shares, shareNumbers });
    jamiya.totalShares -= shares;

    await jamiya.save();

    res.status(200).json({
      message: "Participant added successfully",
      jamiya,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const acceptParticipant = async (req, res) => {
  try {
    const { jcode, participantId } = req.body;

    const jamiya = await jamiyaModel.findOne({ jcode });
    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    const participant = jamiya.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    participant.status = "accepted";
    await jamiya.save();

    res.status(200).json({ message: "Participant accepted", participants: jamiya.participants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error accepting participant" });
  }
};

export const getParticipants = async (req, res) => {
  try {
    const { jcode } = req.body;

    const jamiya = await jamiyaModel.aggregate([
      { $match: { jcode } },
      { $unwind: "$participants" },
      {
        $lookup: {
          from: "users",
          localField: "participants.userId",
          foreignField: "_id",
          as: "user_details"
        }
      },
      { $unwind: { path: "$user_details", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          "participants.userId": 0,
          "user_details.password": 0,
          "user_details.__v": 0
        }
      },
      {
        $group: {
          _id: "$_id",
          participants: { $push: "$participants" },
        }
      }
    ]);

    if (!jamiya || jamiya.length === 0) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    res.status(200).json({ participants: jamiya[0].participants });
    console.log(jamiya[0].participants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching participants" });
  }
};

export const rejectParticipant = async (req, res) => {
  try {
    const { jcode, participantId } = req.body;

    const jamiya = await jamiyaModel.findOne({ jcode });
    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    const participant = jamiya.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    participant.status = "rejected";
    await jamiya.save();

    res.status(200).json({ message: "Participant rejected", participants: jamiya.participants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error rejecting participant" });
  }
};

export const deleteJamiya = async (req, res) => {
  try {
    const jcode = req.params.jcode;

    const jamiya = await jamiyaModel.findOne({ jcode }).populate('participants.userId');

    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    if (jamiya.participants && jamiya.participants.length > 0) {
      return res.status(400).send({ message: "Cannot delete, participants are still present." });
      console.log(jamiya.participants, "participants are still present");
    }

    const delJam = await jamiyaModel.findOneAndDelete({ jcode });

    if (delJam) {
      return res.send({ message: 'Jamiya Deleted.' });
    } else {
      return res.status(500).send({ message: 'Failed to delete Jamiya.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};