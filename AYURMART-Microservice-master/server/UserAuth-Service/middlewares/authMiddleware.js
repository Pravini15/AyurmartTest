import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const authMiddleware = asyncHandler (async (req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token = req.headers?.authorization?.split(" ")[1];
        try {
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log(decoded)
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            console.error(error)
            throw new Error("No authorized token expired, please try again");
        }
    }else{
        throw new Error("There is no Token attached to Header");
    }
});

const isAdmin = asyncHandler (async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== "admin"){
        throw new Error("You are not an admin");
    }else{
        next();
    }
});

export default {
    authMiddleware,
    isAdmin,
};