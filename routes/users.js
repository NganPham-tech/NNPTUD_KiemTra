const express = require('express');
let router = express.Router();
let userSchema = require('../schemas/users');


router.get('/', async (req, res) => {
    try {
        let queries = req.query;
        let usernameQ = queries.username ? queries.username : '';
        
        let users = await userSchema.find({
            isDeleted: false,
            
            username: new RegExp(usernameQ, 'i') 
        }).populate('role', 'name');
        
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: "SOMETHING WENT WRONG" });
    }
});


router.get('/:id', async (req, res) => {
    try {
        let user = await userSchema.findOne({ _id: req.params.id, isDeleted: false }).populate('role', 'name');
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
});


router.post('/', async (req, res) => {
    try {
        let newUser = new userSchema({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        });
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        let updatedUser = await userSchema.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        if (updatedUser) {
            res.send(updatedUser);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        let user = await userSchema.findOne({ _id: req.params.id, isDeleted: false });
        if (user) {
            user.isDeleted = true;
            await user.save();
            res.send(user);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
});


router.post('/enable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await userSchema.findOne({ email: email, username: username, isDeleted: false });
        
        if (user) {
            user.status = true;
            await user.save();
            res.send({ message: "User enabled successfully", user });
        } else {
            res.status(404).send({ message: "Invalid email or username" });
        }
    } catch (error) {
        res.status(500).send({ message: "SOMETHING WENT WRONG" });
    }
});

router.post('/disable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await userSchema.findOne({ email: email, username: username, isDeleted: false });
        
        if (user) {
            user.status = false;
            await user.save();
            res.send({ message: "User disabled successfully", user });
        } else {
            res.status(404).send({ message: "Invalid email or username" });
        }
    } catch (error) {
        res.status(500).send({ message: "SOMETHING WENT WRONG" });
    }
});


router.post('/disable', async (req, res) => {
    try {
        let { email, username } = req.body;
        let user = await userSchema.findOne({ email: email, username: username, isDeleted: false });
        
        if (user) {
            user.status = false;
            await user.save();
            res.send({ message: "User disabled successfully", user });
        } else {
            res.status(404).send({ message: "Invalid email or username" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;