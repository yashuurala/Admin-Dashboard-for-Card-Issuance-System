// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET all transactions with branch info from devices
router.get('/', async (req, res) => {
  try {
    const txns = await Transaction.aggregate([
      // Join account info
      {
        $lookup: {
          from: 'accounts',
          localField: 'accountId',
          foreignField: 'accountId',
          as: 'accountDetails'
        }
      },
      { $unwind: { path: '$accountDetails', preserveNullAndEmptyArrays: true } },

      // Join card type info
      {
        $lookup: {
          from: 'cardtypes',
          localField: 'cardTypeId',
          foreignField: 'cardTypeId',
          as: 'cardTypeDetails'
        }
      },
      { $unwind: { path: '$cardTypeDetails', preserveNullAndEmptyArrays: true } },

      // Join referenced card info
      {
        $lookup: {
          from: 'accountcards',
          localField: 'refCardId',
          foreignField: 'cardId',
          as: 'refCardDetails'
        }
      },
      { $unwind: { path: '$refCardDetails', preserveNullAndEmptyArrays: true } },

      // Join referenced card type
      {
        $lookup: {
          from: 'cardtypes',
          localField: 'refCardDetails.cardTypeId',
          foreignField: 'cardTypeId',
          as: 'refCardTypeDetails'
        }
      },
      { $unwind: { path: '$refCardTypeDetails', preserveNullAndEmptyArrays: true } },

      // Join generation device info
      {
        $lookup: {
          from: 'devices',
          localField: 'generationDeviceId',
          foreignField: 'deviceId',
          as: 'genDeviceDetails'
        }
      },
      { $unwind: { path: '$genDeviceDetails', preserveNullAndEmptyArrays: true } },

      // Join print device info
      {
        $lookup: {
          from: 'devices',
          localField: 'printDeviceId',
          foreignField: 'deviceId',
          as: 'printDeviceDetails'
        }
      },
      { $unwind: { path: '$printDeviceDetails', preserveNullAndEmptyArrays: true } },

      // Join gen branch
      {
        $lookup: {
          from: 'branches',
          localField: 'genDeviceDetails.branchCode',
          foreignField: 'branchCode',
          as: 'genBranchDetails'
        }
      },
      { $unwind: { path: '$genBranchDetails', preserveNullAndEmptyArrays: true } },

      // Join print branch
      {
        $lookup: {
          from: 'branches',
          localField: 'printDeviceDetails.branchCode',
          foreignField: 'branchCode',
          as: 'printBranchDetails'
        }
      },
      { $unwind: { path: '$printBranchDetails', preserveNullAndEmptyArrays: true } },

      // Final output
      {
        $project: {
          refNumber: 1,
          type: 1,
          generationTime: 1,
          printStatus: 1,
          customerName: '$accountDetails.customerName',
          cardTypeName: '$cardTypeDetails.cardTypeName',
          refCardTypeName: '$refCardTypeDetails.cardTypeName',
          genBranch: '$genBranchDetails.branchName',
          genLocation: '$genDeviceDetails.location',
          printBranch: '$printBranchDetails.branchName',
          printLocation: '$printDeviceDetails.location'
        }
      }
    ]);

    res.json(txns);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST transaction
router.post('/', async (req, res) => {
  try {
    const newTxn = new Transaction(req.body);
    await newTxn.save();
    res.status(201).json(newTxn);
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Summary for dashboard
router.get('/summary', async (req, res) => {
  try {
    const total = await Transaction.countDocuments();
    const failed = await Transaction.countDocuments({ printStatus: 'Failed' });
    const recent = await Transaction.find().sort({ generationTime: -1 }).limit(5);
    res.json({ total, failed, recent });
  } catch (err) {
    console.error('Error fetching summary:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
