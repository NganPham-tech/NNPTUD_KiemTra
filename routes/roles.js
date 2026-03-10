const express = require('express');
let router = express.Router();
let roleSchema = require('../schemas/roles');
let userSchema = require('../schemas/users'); 


router.get('/', async (req, res) => {
    try {
        let roles = await roleSchema.find({ isDeleted: false });
        res.send(roles);
    } catch (error) {
        res.status(500).send({ message: "SOMETHING WENT WRONG" });
    }
});


router.get('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findOne({ _id: req.params.id, isDeleted: false });
        if (role) {
            res.send(role);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
});


router.post('/', async (req, res) => {
    try {
        let newRole = new roleSchema({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        let updatedRole = await roleSchema.findByIdAndUpdate(
            req.params.id, req.body, { new: true }
        );
        if (updatedRole) {
            res.send(updatedRole);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findOne({ _id: req.params.id, isDeleted: false });
        if (role) {
            role.isDeleted = true;
            await role.save();
            res.send(role);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
});


router.get('/:id/users', async (req, res) => {
    try {
        let id = req.params.id;
        let users = await userSchema.find({
            role: id,
            isDeleted: false
        }).populate('role', 'name'); 
        
        res.send(users);
    } catch (error) {
        res.status(404).send({ message: "SOMETHING WENT WRONG" });
    }
});

module.exports = router;