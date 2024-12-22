// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import wheelRoutes from './routes/wheelRoutes.js'; // Ensure the path is correct
import axios from 'axios';
import userModel from './models/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';  // For ES6 modules
import jamiyaModel from './models/Jamiya.js';




dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/wheel', wheelRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on https://jamia-server.onrender.com`);
});


console.log('Thawani API Key:', process.env.THAWANI_API_KEY); // Debugging
// Payment initiation endpoint
app.post('/api/payment/initiate', async (req, res) => {
  const { clientId, productName, amount, quantity, successUrl, cancelUrl } = req.body;

  try {
    // Make the Thawani API request
    const response = await axios.post(
      'https://uatcheckout.thawani.om/api/v1/checkout/session',
      {
        client_reference_id: clientId,
        products: [
          {
            name: productName,
            unit_amount: amount,
            quantity: quantity,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'thawani-api-key': process.env.THAWANI_API_KEY, // Ensure you set your Thawani API Key here
        },
      }
    );

    // Get session_id from Thawani response
    const sessionId = response.data.data.session_id;

    // Return the checkout URL to the user
    const checkoutUrl = `https://uatcheckout.thawani.om/pay/${sessionId}?key=${process.env.PUBLISHABLE_KEY}`;
    res.status(200).json({ checkoutUrl });

  } catch (error) {
    console.error('Error during Thawani API request:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || 'Payment initiation failed' });
  }
});


// User Registration Route
app.post('/api/register', async (req, res) => {
  console.log(req.body);
  const { name, email, password, phoneNumber, profileImage } = req.body;

  try {
    // Check if the user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      profileImage,
    });

    await newUser.save();
    console.log('User created successfully');

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token, // Send the token to the client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token, // Send the token to the client
      user,
    });
    console.log('Login successful');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Example using Express.js (Node.js)
app.get('/api/users', async (req, res) => {
  try {
    const users = await userModel.find({ isAdmin: false });

    res.json(users); 
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});




app.get("/getJamiyas",async(req,res)=>{
      try{
          const jamiyas = await jamiyaModel.aggregate([
              {
                  $sort:{createdAt:-1}
              }
             ]);
             return res.status(200).json({jamiya:jamiyas,message:"success"});
      }
      catch(error){
          return res.status(500).json({message:error});
      }
  });


  app.post("/saveJamiya", async (req, res) => {
    console.log(req.body);
    try {

        const jamiya = await jamiyaModel.findOne({ jcode: req.body.jcode });
        if (jamiya) {
            res.send("Jamiya Exist")
        }
        else {
            const newjamiya = new jamiyaModel({

                jcode: req.body.jcode,
                noMembers:  req.body.noMembers,
                noMonths:  req.body.noMonths,
                startDay:  req.body.startDay,
                endDate:  req.body.endDate,
                description:  req.body.description,
                totalShares:req.body.totalShares,
 
            });
            await newjamiya.save();
            res.send("Added..");

        }
    }
    catch (error) {
        console.log(error);
    }
});


app.post("/getJamiya",async(req,res)=>{
    try{
        const Jamiya = await jamiyaModel.findOne({jcode: req.body.jcode});
        if(!Jamiya)
        {
            return res.status(500).json({message:"Jamiya not found.."});
        }
        else
        {
            return res.status(200).json({jamiya:Jamiya,message:"success"});

        }

        
    }
    catch(error)
    {
        return res.status(500).json({message:error});

        
    }
});


// // Endpoint to add user to Jamiya with share count
// app.put('/updateJamiya', async (req, res) => {
//   const { jcode, participant, shares } = req.body;

//   try {
//       // Find the Jamiya by code
//       const jamiya = await Jamiya.findOne({ jcode });
//       if (!jamiya) {
//           return res.status(404).json({ message: 'Jamiya not found' });
//       }

//       // Check if the shares selected are valid (should not exceed the available months)
//       if (shares > jamiya.noMonths) {
//           return res.status(400).json({ message: 'Number of shares exceeds the available months' });
//       }

//       // Check if the user already exists in the Jamiya
//       const participantExists = jamiya.participants.some(p => p.userId.toString() === participant.userId);
//       if (participantExists) {
//           return res.status(400).json({ message: 'User already joined this Jamiya' });
//       }

//       // Check if the total shares for this Jamiya would exceed the number of months
//       const totalShares = jamiya.totalShares + shares;
//       if (totalShares > jamiya.noMonths) {
//           return res.status(400).json({ message: 'Total shares exceed the number of months available' });
//       }

//       // Add the participant with the selected shares and 'pending' status
//       jamiya.participants.push({ userId: participant.userId, status: 'pending', shares });
//       jamiya.totalShares += shares;  // Update the total shares count

//       // Save the updated Jamiya
//       await jamiya.save();

//       return res.status(200).json({ message: 'User added to Jamiya with selected shares', jamiya });
//   } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: 'Error updating Jamiya' });
//   }
// });
// PUT endpoint to add participants
app.put("/jamiya/participants", async (req, res) => {
  const { jcode, participantName, shares } = req.body;

  try {
    // Find the Jamiya by jcode
    const jamiya = await jamiyaModel.findOne({ jcode });

    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    // Check if there are enough shares available
    if (shares > jamiya.totalShares) {
      return res.status(400).json({
        message: "Not enough shares available",
        totalShares: jamiya.totalShares,
      });
    }

    // Add the participant
    jamiya.participants.push({ participantName, shares });
    jamiya.totalShares -= shares; // Deduct the allocated shares

    // Save the updated document
    await jamiya.save();

    // Respond with the updated Jamiya document
    res.status(200).json({
      message: "Participant added successfully",
      jamiya,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from the 'Authorization' header
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user data to request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply the middleware to protected routes
app.use('/api/protected-route', verifyToken, (req, res) => {
  // Protected route logic
  res.status(200).json({ message: 'This is a protected route' });
});


app.post('/api/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;  // Retrieve refresh token from cookies
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });  // Send the new access token
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});




// Accept a participant
app.put("/acceptParticipant", async (req, res) => {
  try {
    const { jcode, participantId } = req.body;

    // Find the Jamiya by code
    const jamiya = await jamiyaModel.findOne({ jcode });
    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    // Find the participant by their ID and update their status to "accepted"
    const participant = jamiya.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    participant.status = "accepted"; // Mark the participant as accepted
    await jamiya.save();

    res.status(200).json({ message: "Participant accepted", participants: jamiya.participants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error accepting participant" });
  }
});

app.post("/getParticipants", async (req, res) => {
  try {
    const { jcode } = req.body; // Expect jcode in the request body

    // Use aggregation to fetch the participants and join with user details
    const jamiya = await jamiyaModel.aggregate([
      {
        $match: { jcode } // Match the jamiya document by jcode
      },
      {
        $unwind: "$participants" // Unwind participants array
      },
      {
        $lookup: {
          from: "users", // Assuming user details are in the 'users' collection
          localField: "userId", // Field in participants that references users
          foreignField: "_id", // The _id field in users collection
          as: "user_details" // Field that will contain user details
        }
      },
      {
        $unwind: { path: "$user_details", preserveNullAndEmptyArrays: true } // Unwind user details (if any)
      },
      {
        $project: {
          "participants.userId": 0, // Optionally remove the userId field from participants
          "user_details.password": 0, // Remove sensitive fields like password
          "user_details.__v": 0 // Optionally remove the version field from user details
        }
      },
      {
        $group: {
          _id: "$_id", // Group by the jamiya document ID
          participants: { $push: "$participants" }, // Reassemble the participants array
        }
      }
    ]);

    // Check if jamiya data is found
    if (!jamiya || jamiya.length === 0) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    // Return the participants list with user details
    res.status(200).json({ participants: jamiya[0].participants });
    console.log(jamiya[0].participants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching participants" });
  }
});




// Reject a participant
app.put("/rejectParticipant", async (req, res) => {
  try {
    
    const { jcode, participantId } = req.body;

    // Find the Jamiya by code
    const jamiya = await jamiyaModel.findOne({ jcode });
    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    // Find the participant by their ID and update their status to "rejected"
    const participant = jamiya.participants.id(participantId);
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    participant.status = "rejected"; // Mark the participant as rejected
    await jamiya.save();

    res.status(200).json({ message: "Participant rejected", participants: jamiya.participants });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error rejecting participant" });
  }
});




app.delete("/deleteJamiya/:jcode", async (req, res) => {
  try {
    const jcode = req.params.jcode;

    // Fetch the Jamiya and check the number of participants
    const jamiya = await jamiyaModel.findOne({ jcode: jcode }).populate('participants.userId');

    if (!jamiya) {
      return res.status(404).json({ message: "Jamiya not found" });
    }

    // Check if there are any participants
    if (jamiya.participants && jamiya.participants.length > 0) {
      return res.status(400).send({ message: "Cannot delete, participants are still present." });
      console.log(jamiya.participants , "participants are still present");
    }

    // Proceed to delete if no participants
    const delJam = await jamiyaModel.findOneAndDelete({ jcode: jcode });

    if (delJam) {
      return res.send({ message: 'Jamiya Deleted.' });
    } else {
      return res.status(500).send({ message: 'Failed to delete Jamiya.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server Connected...");
});


// const options = {
//   method: 'POST',
//   url: 'https://uatcheckout.thawani.om/api/v1/checkout/session',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'thawani-api-key': process.env.THAWANI_API_KEY, // Use the environment variable here
//   },
//   data: {
//     client_reference_id: '12345', 
//     products: [
//       { name: 'Test Product', unit_amount: 1000, quantity: 1 },
//     ],
//     success_url: 'https://example.com/success',
//     cancel_url: 'https://example.com/cancel',
//   },
// };

// try {
//   const response = await axios.request(options);
//   console.log(response.data);
// } catch (error) {
//   console.error('Error:', error.response?.data || error.message);
// }
