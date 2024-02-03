require('dotenv').config();

console.log(process.env.MONGODB_URI); // Verify availability of the variable

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// User model
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  neighborhood: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' }],
  firstName: String,
  lastName: String,
  age: Number,
  address: String,
  credits: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}));

// Post model
const Post = mongoose.model('Post', new mongoose.Schema({
  postName: String,
  postType: String,
  serviceOrTool: String,
  neededBy: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  neighborhood: { type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood', required: true },
  lenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));

// Neighborhood model
const NeighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  administrator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // This now expects an array of User IDs
});

// Account creation route
app.post('/create-account', async (req, res) => {
  const { username, password, firstName, lastName, age, address } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, firstName, lastName, age, address });
  try {
    const savedUser = await newUser.save();
    res.status(201).send({ message: 'Account created successfully', userId: savedUser._id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ userId: user._id });
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Fulfill post route
app.post('/fulfill-post/:postId', async (req, res) => {
  const { userId, rating } = req.body; // Fulfiller's userId and rating for the post creator
  const { postId } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).send('Invalid rating provided.');
  }

  try {
    const post = await Post.findById(postId).populate('userId');
    if (!post) {
      return res.status(404).send('Post not found.');
    }

    const creator = await User.findById(post.userId);
    const fulfiller = await User.findById(userId);

    if (!creator || !fulfiller) {
      return res.status(404).send('User not found.');
    }

    // Simulated rating update logic (you'll need to adjust based on your rating system)
    const newRating = ((creator.rating || 0) + rating) / 2; // Simplified rating calculation
    creator.rating = newRating;
    fulfiller.credits += 1; // Issue credit to fulfiller
    creator.credits -= 1; // Subtract credit from creator

    await fulfiller.save();
    await creator.save();

    res.send('Request fulfilled successfully, credits and rating updated.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fulfill request.');
  }
});

// Additional routes (create-post, posts, user-posts, etc.) remain unchanged

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
