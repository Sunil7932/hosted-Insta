const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST")
// Route

router.get("/allposts", requireLogin, (req, res) => {
    POST.find()
        .populate("postedBy", "_id name Photo")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(posts => res.json(posts)).catch(
            err => console.log(err)
        )
})
router.post("/createPost", requireLogin, (req, res) => {
    const { body, pic } = req.body;
    console.log(pic)
    if (!body || !pic) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    console.log(req.user);
    const post = new POST({
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save().then((result) => {
        return res.json({ post: result })
    }).catch(err => console.log(err))
})

router.get("/myposts", requireLogin, (req, res) => {
    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .sort("-createdAt")
        .then(myposts => {
            res.json(myposts)
        })
    console.log(req.user)
})

router.put("/like", requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name Photo");

        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

router.put("/unlike", requireLogin, async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("postedBy", "_id name Photo");

        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err });
    }
});

router.put("/comment", requireLogin, async (req, res) => {
    try {
        const comment = {
            comment: req.body.text,
            postedBy: req.user._id,
        };

        const result = await POST.findByIdAndUpdate(
            req.body.postId,
            {
                $push: { comments: comment },
            },
            { new: true }
        )
            .populate("comments.postedBy", "_id name")
            .populate("postedBy", "_id name Photo")
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});

// Api to delete post
// const mongoose = require('mongoose');

router.delete("/deletePost/:postId", requireLogin, async (req, res) => {
    try {
        const postId = req.params.postId;

        console.log("Post ID:", postId);
        console.log("Logged-in user ID:", req.user._id);

        const post = await POST.findOne({ _id: postId }).populate("postedBy", "_id");
        console.log(post);
        if (!post) {
            return res.status(422).json({ error: "Post not found" });
        }

        console.log("Post created by user ID:", post.postedBy._id);

        if (post.postedBy._id.toString() === req.user._id.toString()) {
            await post.deleteOne();
            return res.json({ message: "Successfully deleted" });
        } else {
            return res.status(403).json({ error: "Unauthorized action" });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});


// to show following post

router.get("/myfollowingpost", requireLogin, async (req, res) => {
    POST.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json(posts)
    }).catch(err=>{console.log(err)})
})
module.exports = router;