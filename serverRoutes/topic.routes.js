/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
// Запрещен await in loop
/* eslint-disable no-await-in-loop */
/* eslint-disable import/extensions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
const { Router } = require('express');
const User = require('../serverModels/user.ts');
const Topic = require('../serverModels/topic.ts');
const Comment = require('../serverModels/comment.ts');

const router = Router();
const cleanerBase = async () => {
    await User.collection.drop();
    await Topic.collection.drop();
    await Comment.collection.drop();
};

router.post('/create', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.body.id });
        const { _id } = user;
        const topic = new Topic({ ...req.body, ...{ user: _id } });
        await topic.save();
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/read', async (req, res) => {
    try {
        const topic = await Topic.find();
        for (let index = 0; index < topic.length; index++) {
            const { user } = topic[index].toJSON();
            const userFind = await User.findOne({ _id: user });
            topic[index] = {
                ...topic[index].toJSON(),
                ...{ user: userFind },
            };
        }
        res.json(topic);
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/update', async (req, res) => {
    try {
        await Topic.updateOne({ _id: req.body._id }, { $set: req.body });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { _id } = req.body;
        await Topic.deleteOne({ _id });
        res.status(201).json({ message: 'OK' });
    } catch (e) {
        res.status(500).json({
            message: 'Что-то пошло не так, попробуйте еще раз',
        });
    }
});

module.exports = router;
