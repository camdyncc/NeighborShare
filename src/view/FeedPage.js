import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { AppBar, Toolbar, Typography, Button, Card, CardContent, CardActions, Modal, Box, Grid, Container, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Theme customization
const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#527853',
    },
    secondary: {
      main: '#F9E8D9',
    },
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState('');
  const [rating, setRating] = useState(5);
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!authState.userId) return;
      try {
        const response = await axios.get(`http://localhost:5000/user-neighborhoods/${authState.userId}`);
        const neighborhoodId = response.data?._id;
        const postsResponse = await axios.get(`http://localhost:5000/posts?neighborhoodId=${neighborhoodId}`);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, [authState.userId]);

  const handleOpen = (postId) => {
    setCurrentPostId(postId);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleFulfillment = async () => {
    try {
      //await axios.post(`http://localhost:5000/fulfill-post/${currentPostId}`, { userId: authState.userId, rating });
      handleClose();
      alert('Request fulfilled successfully!');
    } catch (error) {
      console.error('Failed to fulfill request:', error);
      alert('Failed to fulfill request.');
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  return (
    <div className="feed-page-background">
    <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              NeighborShare
            </Typography>
            <Button color="inherit" component={Link} to="/new-post">New Post</Button>
            <Button color="inherit" component={Link} to="/user-post-page">Your Posts</Button>
            <Button color="inherit" component={Link} to="/create-neighborhood">New Neighborhood</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ mt: 4, mb: 8 }}>
          <Grid container spacing={4} justifyContent="center">
            {posts.map((post) => (
              <Grid item key={post._id} xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.postName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posted by: {post.userId.firstName} {post.userId.lastName}<br />
                      Type: {post.postType}<br />
                      Needed: {post.serviceOrTool}<br />
                      Needed by: {new Date(post.neededBy).toLocaleDateString()}<br />
                      Borrow Rating: {post.userId.credits}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleOpen(post._id)}>Fulfill Request</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Rate Fulfillment
            </Typography>
            <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <Button onClick={handleFulfillment} style={{ marginTop: '10px' }}>Submit Rating</Button>
          </Box>
        </Modal>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, mt: 'auto' }} component="footer">
          <Typography variant="body1" align="center">
            &copy; 2024 NeighborShare. All rights reserved.
          </Typography>
        </Box>
      
    </ThemeProvider>
    </div>
  );
};

export default FeedPage;
