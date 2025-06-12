import { generateToken } from "../lib/utils.js";
import User from '../models/user.model.js'      
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import dotenv from 'dotenv';

dotenv.config(); 


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
  

export const signup = async (req, res) => {
    
    const { fullName, email, password } = req.body

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            });     
        } else {
            res.status(400).json({ message: "Failed to create user" });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signin = async (req, res) => { 

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({nessage: "invalid credentials"})
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        })

    } catch (error) {
        console.log("Error in signin controller", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0,})
        res.status(200).json({ message: "Signout successful" });

    } catch (error) {
        console.log("Error in signout controller", error.message)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => { 
    try {
      const { profilePicture } = req.body;
      const userId = req.user._id;
  
      if (!profilePicture) {
        return res.status(400).json({ message: "Please provide a profile picture" });
      }
  
      const uploadResponse = await cloudinary.v2.uploader.upload(profilePicture);
      console.log("Uploaded image URL:", uploadResponse.secure_url);
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: uploadResponse.secure_url }, // ✅ use correct field name
        { new: true }
      );
  
      console.log("Updating user with ID:", userId);
      console.log("Updated user:", updatedUser);
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("Error in updateProfile controller:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  export const checkAuth = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      res.status(200).json(user); // return full user data
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };