const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');

router.get('/', async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

router.post('/', async (req, res) => {
  const newBranch = new Branch(req.body);
  await newBranch.save();
  res.status(201).json(newBranch);
});

module.exports = router;
