const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load idea model
// require('../models/User');
// const User = mongoose.model('users');

//User login route
router.get('/login', (req, res) => {
	res.render('users/login');
});

//User register route
router.get('/register', (req, res) => {
	res.render('users/register');
});



module.exports = router;