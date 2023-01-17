const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('../models/Users.js');
const jwt = require('jsonwebtoken');
const {
  check,
  validationResult
} = require('express-validator');
const authMiddleware = require('../lib/authMiddleware.js');
const authRoute = express.Router();

// Crypto
const salt = crypto.randomBytes(16).toString('hex');
const iterations = 100000;
const keylen = 64;
const digest = 'sha512';

authRoute.post('/register', [
  check('email').isEmail().withMessage('Email tidak valid').custom((value) => {
    return Users.findOne({
      email: value
    }).then((user) => {
      if (user) {
        return Promise.reject('Email sudah terdaftar');
      }
    });
  }),
  check('password').isLength({
    min: 8
  }).matches(/\d/).matches(/[a-zA-Z]/).withMessage('Password tidak valid')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  var hash = bcrypt.hashSync(req.body.password, 10);

  const newUser = await new Users({
    name: req.body.name,
    email: req.body.email,
    password: hash
  });

  try {
    const savedUser = await newUser.save();
    res.send('User berhasil disimpan');

  } catch (error) {
    res.status(500).send(err);
  }
});

authRoute.post('/login', [
  check('email').isEmail().withMessage('Email tidak valid').custom((value) => {
    return Users.findOne({
      email: value
    }).then((user) => {
      if (!user) {
        return Promise.reject('Email atau password salah');
      }
    });
  }),
  check('password').isLength({
    min: 8
  }).matches(/\d/).matches(/[a-zA-Z]/).withMessage('Email atau password salah')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  try {
    const user = await Users.findOne({
      email: req.body.email
    });
    if (!user) {
      res.status(404).send('Pengguna tidak ditemukan');
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // Buat token JWT
        const token = await jwt.sign({
          id: user._id,
          name: user.name
        }, process.env.SECRET_KEY, {
          expiresIn: '1d'
        });
        res.send({
          auth: true,
          token: token
        });

      } else {
        res.status(401).send('Email atau password salah');
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

authRoute.get('/checkAuth', authMiddleware, (req, res) => {
  res.send({
    auth: true,
    user: req.user
  })
})

module.exports = authRoute;