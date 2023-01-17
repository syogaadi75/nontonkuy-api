const express = require('express');
const Users = require('../models/Users.js');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  check,
  validationResult
} = require('express-validator');
const authMiddleware = require('../lib/authMiddleware.js');
const authRoute = express.Router();

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
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  const newUser = new Users({
    name: req.body.name,
    email: req.body.email,
    // password: bcrypt.hashSync(req.body.password, 10)
    password: req.body.password
  });

  newUser.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('User berhasil disimpan');
    }
  });
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
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  Users.findOne({
    email: req.body.email
  }, (err, user) => {
    if (err) {
      res.status(500).send(err);
    } else if (!user) {
      res.status(404).send('Pengguna tidak ditemukan');
    } else {
      // if (bcrypt.compareSync(req.body.password, user.password)) {
      // Buat token JWT
      const token = jwt.sign({
        id: user._id,
        name: user.name
      }, process.env.SECRET_KEY, {
        expiresIn: '1d'
      });
      res.send({
        auth: true,
        token: token
      });
      // } else {
      //   res.status(401).send('Email atau password salah');
      // }
    }
  });
});

authRoute.get('/checkAuth', authMiddleware, (req, res) => {
  res.send({
    auth: true,
    user: req.user
  })
})

module.exports = authRoute;