import mongoose from 'mongoose';

const UserSchema=mongoose.Schema({
    fullName:{type:String,requreed:true},
    uname:{type:String,requreed:true},
    pnumber:{type:String,requreed:true},
    password:{type:String,requreed:true},
});

const UserModel=mongoose.model('User',UserSchema,"User");
export default UserModel;