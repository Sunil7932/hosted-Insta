const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER"); 

// Get user profile
router.get("/user/:id", async (req, res) => {
    try {
        // Find the user by ID, excluding the password field
        const user = await USER.findOne({ _id: req.params.id }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find all posts by this user
        const post = await POST.find({ postedBy: req.params.id })
            .populate("postedBy", "_id");

        return res.status(200).json({ user, post });
    } catch (err) {
        console.error(err);
        return res.status(422).json({ error: err.message });
    }
});

// Follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        // Add the current user to the followers of the target user
        const updatedUser = await USER.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Add the target user to the current user's following list
        await USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true });

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        return res.status(422).json({ error: err.message });
    }
});

// Unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        // Remove the current user from the followers of the target user
        const updatedUser = await USER.findByIdAndUpdate(req.body.followId, {
            $pull: { followers: req.user._id }
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove the target user from the current user's following list
        await USER.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        }, { new: true });

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        return res.status(422).json({ error: err.message });
    }
});

// to upload profile pic
router.put("/uploadProfilePic", requireLogin, async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(req.user._id, {
            $set: { Photo: req.body.pic }
        }, {
            new: true
        });

        res.json(result);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

module.exports = router;
