require('dotenv').config();

console.log(process.env.MONGODB_URI); // Verify availability of the variable

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

// Connect to MongoDB (with asynchronous handling)
mongoose.connect("mongodb+srv://camdyncoblentz:mongoDB060300@cluster0.th4c6ux.mongodb.net/users?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User model 
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // Change to array of nighborhoods
  firstName: String,
  lastName: String,
  age: Number,
  address: String,
}));





// Routes
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.post('/create-account', async (req, res) => {
  try {
    const customId = uuidv4();
    const { username, password, firstName, lastName, age, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ customerId: customId, username, password: hashedPassword, firstName, lastName, age, address });
    const savedUser = await newUser.save();
    res.status(201).send({ message: 'Account created successfully', customerId: savedUser._id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    console.log({userId: user._id});
    if (user && await bcrypt.compare(password, user.password)) {
      
      res.status(200).json({ userId: user._id }); // Send the user ID in the response
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
