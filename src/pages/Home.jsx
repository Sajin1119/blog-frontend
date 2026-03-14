import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get('posts/')
      .then(res => setPosts(res.data.results))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />
      <h1>All Posts</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Home;