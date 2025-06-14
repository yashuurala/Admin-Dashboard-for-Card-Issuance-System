const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

router.get('/', async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

router.post('/', async (req, res) => {
  const newAcc = new Account(req.body);
  await newAcc.save();
  res.status(201).json(newAcc);
});

module.exports = router;
