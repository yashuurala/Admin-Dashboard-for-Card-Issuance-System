const express = require('express');
const router = express.Router();
const AccountCard = require('../models/AccountCard');
const Account = require('../models/Account');
const CardType = require('../models/CardType');

// GET all account cards with customer name & card type name
router.get('/', async (req, res) => {
  try {
    const cards = await AccountCard.aggregate([
      {
        $lookup: {
          from: 'accounts',
          localField: 'accountId',
          foreignField: 'accountId',
          as: 'accountDetails'
        }
      },
      {
        $lookup: {
          from: 'cardtypes',
          localField: 'cardTypeId',
          foreignField: 'cardTypeId',
          as: 'cardTypeDetails'
        }
      },
      { $unwind: { path: '$accountDetails', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$cardTypeDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          customerName: '$accountDetails.customerName',
          cardTypeName: '$cardTypeDetails.cardTypeName',
          maskedCardNumber: 1,
          issuedDate: 1,
          expiryDate: 1
        }
      }
    ]);
    res.json(cards);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new account card
router.post('/', async (req, res) => {
  try {
    const newCard = new AccountCard(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
