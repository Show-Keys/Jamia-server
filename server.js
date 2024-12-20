// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import wheelRoutes from './routes/wheelRoutes.js'; // Ensure the path is correct
import UserModel from './models/User.js';
import AdminModel from './models/Admin.js';

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

const conStr= "mongodb+srv://1rexv:1234@mycluster0.we9dyvw.mongodb.net/full-stack?retryWrites=true&w=majority";
mongoose.connect(conStr);

//Registration
app.post('/insertUser', async (req, res) => {
    try {
        const user = await UserModel.findOne({ uname: req.body.uname });
        if (user) {
            res.status(400).send('User Exists ...');
        } else {
            const hpass = await bcrypt.hash(req.body.password, 10);
            const newuser = new UserModel({
                fullName: req.body.fullName,
                uname: req.body.uname,
                pnumber: req.body.pnumber,
                password: hpass,
                adminCode: req.body.adminCode, // Ensure field name matches
            });
            await newuser.save();
            res.status(200).send("User Added..");
        }
    } catch (error) {
        console.error("Error in insertUser", error);
        res.status(500).send("Server Error");
    }
});

//user login
app.post("/userLogin", async (req, res) => {
    try {
        const user = await UserModel.findOne({ uname: req.body.uname });
        if (!user) {
            return res.status(404).json({ message: "User not found.." });
        }
        const passMatch = await bcrypt.compare(req.body.password, user.password);
        if (passMatch) {
            return res.status(200).json({ user, message: "success" });
        } else {
            return res.status(401).json({ message: "Authorization Failed" });
        }
    } catch (error) {
        console.error("Error in userLogin", error);
        res.status(500).json({ message: "Server Error" });
    }
});

//admin login
app.post("/adminLogin",async(req,res)=>{
    try{
        const admin= await AdminModel.findOne({email:req.body.email});
        if(!admin)
        {
            return res.status(500).json({message:"admin not found.."});
        }
        else{
            // const passMatch=await bcrypt.compare(req.body.password,admin.password);
            if(admin.password === req.body.password)
                return res.status(200).json({Admins:admin,message:"success"});
            else
                return res.status(401).json({message:"Authorization Failed"});
        }
    }
    catch(error)
    {
        return res.status(500).json({message:error});
    }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
