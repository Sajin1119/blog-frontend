import React, { useState } from 'react';
import API from '../api/axios';

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    API.post(`comments/post/${postId}/`, { content })
      .then(() => setContent(''))
      .catch(err => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Add a comment" required />
      <button type="submit">Comment</button>
    </form>
  );
};

export default CommentForm;