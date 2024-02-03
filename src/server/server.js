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
  neighborhood: { type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood' },
  firstName: String,
  lastName: String,
  age: Number,
  address: String,
}));

// Post model
const Post = mongoose.model('Post', new mongoose.Schema({
  postName: String,
  postType: String,
  serviceOrTool: String,
  neededBy: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  neighborhood: { type: mongoose.Schema.Types.ObjectId, ref: 'Neighborhood', required: true },
}));

// Neighborhood model
const NeighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  administrator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);



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


// Create new post
app.post('/create-post', async (req, res) => {
  try {
    const { postName, postType, serviceOrTool, neededBy, userId, neighborhood } = req.body;
    const newPost = new Post({
      postName,
      postType,
      serviceOrTool,
      neededBy,
      userId,
      neighborhood
    });

    await newPost.save();
    res.status(201).send('Post created successfully');
  } catch (error) {
    console.error(error);
    res.status(400).send('Failed to create post');
  }
});

// Get posts for feed page
app.get('/posts', async (req, res) => {
  const { neighborhoodId } = req.query;

  try {
    let query = {};
    if (neighborhoodId) {
      query.neighborhood = neighborhoodId; // Filter by neighborhoodId if provided
    }

    const posts = await Post.find(query).populate('userId', 'firstName lastName');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Failed to get posts:', error);
    res.status(500).send('Failed to get posts');
  }
});



// Get a given users post
app.get('/user-posts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User id: " + userId);
    const posts = await Post.find({ userId });
    res.json(posts);
  } catch (error) {
    console.error('Failed to get user posts:', error);
    res.status(500).json({ error: 'Failed to get user posts' });
  }
});

// Get user for profile data
app.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("User id profile: " + userId);
    const user = await User.findById(userId);
    if (!user) {
      // If the user does not exist
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to get user posts:', error);
    res.status(500).json({ error: 'Failed to get user posts' });
  }
});

// Update user info after edit
app.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, age, address } = req.body;

    // Find the user by userId and update their data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, age, address },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Failed to update user data:', error);
    res.status(500).json({ error: 'Failed to update user data' });
  }
});


// Delete post
app.delete('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    res.send('Post deleted successfully');
  } catch (error) {
    res.status(500).send('Failed to delete post');
  }
});

// Update post
app.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Failed to get the post:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new neighbohood
// User who created it is the admin
app.post('/create-neighborhood', async (req, res) => {
  try {
    const { name, userId } = req.body;
    const newNeighborhood = new Neighborhood({
      name,
      administrator: userId,
      users: [userId] 
    });
    await newNeighborhood.save();

    await User.findByIdAndUpdate(userId, { neighborhood: newNeighborhood._id });
    res.status(201).json(newNeighborhood);
  } catch (error) {
    console.error('Failed to create neighborhood:', error);
    res.status(400).send('Failed to create neighborhood');
  }
});

// Get users neighborhoods
app.get('/user-neighborhoods/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('neighborhood');
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Assuming a user can belong to multiple neighborhoods, or adjust as necessary
    res.json(user.neighborhood);
  } catch (error) {
    console.error('Failed to get neighborhoods for user:', error);
    res.status(500).send('Server error');
  }
});




// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
