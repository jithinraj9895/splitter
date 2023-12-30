const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

const app = express();
const port = 3000;


// Middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User model
const userSchema = new mongoose.Schema({
  name: String,
  currentMoney: Number,
});

const User = mongoose.model('User', userSchema, 'Users');


app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { _id: 0 }); // Exclude _id field
    console.log(users.length);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/users/:name/add-money', async (req, res) => {
  const { name } = req.params;
  const { addedMoney } = req.body;
  try {
    const user = await User.findOne({ name: name });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the currentMoney field by adding the specified amount
    user.currentMoney += addedMoney;

    // Save the updated user
    await user.save();

    res.json(user);
    
  } catch (error) {
    console.error('Error updating currentMoney:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/', (req, res) => {
  res.send('Hello, this is a sample GET request!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

