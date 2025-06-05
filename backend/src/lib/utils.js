import jwt from "jsonwebtoken"
const week = 7 * 24 * 60 * 60 * 1000 

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !=="development",
        sameSite: "strict",
        maxAge: week
    })

    return token
}