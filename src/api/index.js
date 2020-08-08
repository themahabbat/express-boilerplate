const express = require('express');
const monk = require('monk');

const db = monk(process.env.MONGO_URI)
const notes = db.get('notes')

const emojis = require('./emojis');
const { route } = require('./emojis');

const router = express.Router();

router.post('/note/add', async (req, res, next) => {

    try {
        const data = req.body

        const inserted = await notes.insert({
            title: data.title,
            desc: data.desc
        });

        res.json(inserted)
    } catch (error) {
        next(error)
    }

});

router.get('/note/:id', async (req, res, next) => {

    try {
        const note = await notes.findOne({ _id: req.params.id })
        if (!note) next()

        res.json(note)
    } catch (error) {
        next(error)
    }

});

router.delete('/note/:id', async (req, res, next) => {

    try {
        notes.remove({ _id: req.params.id })

        res.json({ code: 'done' })
    } catch (error) {
        next(error)
    }

})

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});

router.use('/emojis', emojis);

module.exports = router;
