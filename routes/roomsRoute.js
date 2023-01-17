const express = require('express');
const Rooms = require('../models/Rooms.js');
const {
    check,
    validationResult
} = require('express-validator');
const router = express.Router();

// Get all room
router.get('/', (req, res) => {
    Rooms.find()
        .populate('master', 'name email')
        .populate('users', 'name email')
        .then(rooms => {
            res.send(rooms);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error occured'
            });
        });
});

// Get all public room
router.get('/public', (req, res) => {
    Rooms.find({
            isPrivate: false
        })
        .populate('master', 'name email')
        .populate('users', 'name email')
        .then(rooms => {
            res.send(rooms);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error occured'
            });
        });
});

// Get room by id
router.get('/:id', [
    check('id').not().isEmpty().withMessage('ID is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }

    Rooms.findById(req.params.id)
        .populate('master', 'name email')
        .populate('users', 'name email')
        .then(room => {
            if (!room) {
                return res.status(404).send({
                    message: 'Room not found'
                });
            }
            res.send(room);
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error occured'
            });
        });
});

// Room by id & id user
router.get('/:roomId/users/:userId', [
    check('roomId').not().isEmpty().withMessage('Id room dibutuhkan'),
    check('userId').not().isEmpty().withMessage('Id user dibutuhkan'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }

    try {
        const room = await Rooms.findOne({
            _id: req.params.roomId
        });
        const isExist = room.users.includes(req.params.userId)
        if (isExist) {
            return res.send(room);
        } else {
            return res.status(404).send({
                message: 'user not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
});

// Membuat room baru
router.post('/create', [
    check('name').not().isEmpty().withMessage('Name is required'),
    check('master').not().isEmpty().withMessage('Master is required'),
    check('videoLinks').not().isEmpty().withMessage('Video links are required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }

    const room = new Rooms({
        name: req.body.name,
        master: req.body.master,
        videoLinks: req.body.videoLinks,
        isPrivate: req.body.isPrivate,
        users: [req.body.master]
    });

    room.save()
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// Join room
router.patch('/:id/join', [
    check('id').not().isEmpty().withMessage('ID is required'),
    check('userId').not().isEmpty().withMessage('User ID is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }

    Rooms.findById(req.params.id)
        .then(room => {
            if (!room) {
                return res.status(404).send({
                    message: 'Room not found'
                });
            }

            if (room.users.includes(req.body.userId)) {
                return res.status(400).send({
                    message: 'User already in room'
                });
            }

            room.users.push(req.body.userId);
            room.save()
                .then(room => {
                    res.send(room);
                })
                .catch(err => {
                    res.status(500).send({
                        message: 'Error occured'
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error occured'
            });
        });
});


// Exit room
router.patch('/:id/exit', [
    check('id').not().isEmpty().withMessage('ID is required'),
    check('userId').not().isEmpty().withMessage('User ID is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array()
        });
    }

    Rooms.findById(req.params.id)
        .then(room => {
            if (!room) {
                return res.status(404).send({
                    message: 'Room not found'
                });
            }

            const index = room.users.indexOf(req.body.userId);
            if (index === -1) {
                return res.status(400).send({
                    message: 'User not found in room'
                });
            }

            room.users.splice(index, 1);
            room.save()
                .then(room => {
                    res.send(room);
                })
                .catch(err => {
                    res.status(500).send({
                        message: 'Error occured'
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: 'Error occured'
            });
        });
});


module.exports = router;