import { generateToken } from "../lib/utils.js";
import User from '../models/user.model.js'      
import bcrypt from "bcryptjs";

export const signup = async  (req,res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        if (!fullName) {
            return res.status(400).json({ message: "Please put your full name" });
        }
        if (!email) {
            return res.status(400).json({ message: "Please put your email" });
        }
        if (!password) {
            return res.status(400).json({ message: "Please put your password" });
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

export const signin = () => { 
    res.send("signin route")
}

export const signout = () => {
    res.send("signout route")
}