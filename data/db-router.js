const express = require("express");

const posts = require("./db");

const router = express.Router();

router.post("/", (req, res) => {
    const body = req.body;
    if(!body.title || !body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        posts.insert(body).then(post => {
            res.status(201).json(post);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        })
    }
})

router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const body = {...req.body, post_id: id}
    if(!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else if(!body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    } else {
        posts.insertComment(body).then(comment => {
            res.status(201).json(comment);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: "The comments information could not be retrieved." });
        })
    }
})

router.get("/", (req, res) => {
    posts.find().then(post => {
        res.status(200).json(post);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
})

router.get("/:id", (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else {
        posts.findById(id).then(post => {
            res.status(200).json(post);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
    }
})

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else {
        posts.findPostComments(id).then(comment => {
            res.status(200).json(comment);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
    }
})

router.delete("/:id", (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else {
        posts.remove(id).then(post => {
            res.status(200).json(post);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post could not be removed" });
        })
    }
})

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;
    if(!id) {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else if(!body.title || !body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    } else {
        posts.update(id, req.body).then(post => {
            res.status(200).json(post);
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be modified." });
        })
    }
})

module.exports = router;