import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    API.get(`posts/${postId}/likes/`).then(res => setCount(res.data.likes));
  }, [postId]);

  const handleLike = () => {
    API.post(`posts/${postId}/like/`)
      .then(res => {
        setLiked(res.data.message === "Post liked");
        setCount(prev => (res.data.message === "Post liked" ? prev + 1 : prev - 1));
      })
      .catch(err => console.log(err));
  };

  return (
    <button onClick={handleLike}>
      {liked ? 'Unlike' : 'Like'} ({count})
    </button>
  );
};

export default LikeButton;