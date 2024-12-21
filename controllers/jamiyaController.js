import jamiyaModel from '../models/Jamiya.js';

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
        noMembers: req.body.noMembers,
        noMonths: req.body.noMonths,
        startDay: req.body.startDay,
        endDate: req.body.endDate,
        description: req.body.description,
        totalShares: req.body.totalShares,
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
  const { jcode, participantName, shares } = req.body;

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

    jamiya.participants.push({ participantName, shares });
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

    const jamiya = await jamiyaModel.findOne({ jcode }).populate('participants.userId', 'name email');

    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    res.status(200).json({ participants: jamiya.participants });
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