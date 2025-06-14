const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Branch = require('../models/Branch');

// GET all devices with branch name resolved
router.get('/', async (req, res) => {
  try {
    const devices = await Device.aggregate([
      {
        $lookup: {
          from: 'branches',
          localField: 'branchCode',
          foreignField: 'branchCode',
          as: 'branchDetails'
        }
      },
      { $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          deviceId: 1,
          branchCode: 1,
          branchName: '$branchDetails.branchName',
          location: 1,
          type: 1,
          uniqueId: 1,
          hopperCount: 1,
          status: 1
        }
      }
    ]);
    res.json(devices);
  } catch (err) {
    console.error('Error fetching devices:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new device
router.post('/', async (req, res) => {
  try {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (err) {
    console.error('Error adding device:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET count of active devices
router.get('/active-count', async (req, res) => {
  try {
    const active = await Device.countDocuments({ status: 'Active' });
    res.json({ active });
  } catch (err) {
    console.error('Error fetching active count:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
