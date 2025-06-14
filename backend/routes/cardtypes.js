const express = require('express');
const router = express.Router();
const CardType = require('../models/CardType');

// GET all card types
router.get('/', async (req, res) => {
  const types = await CardType.find();
  res.json(types);
});

// POST new card type
router.post('/', async (req, res) => {
  try {
    const newCardType = new CardType(req.body);
    await newCardType.save();
    res.status(201).json(newCardType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
