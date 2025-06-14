const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/cardtypes', require('./routes/cardtypes'));
app.use('/api/accountcards', require('./routes/accountcards'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
