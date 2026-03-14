import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    API.get(`comments/post/${postId}/`)
      .then(res => setComments(res.data))
      .catch(err => console.log(err));
  }, [postId]);

  const renderComments = (comments, parentId = null, level = 0) =>
    comments
      .filter(c => c.parent === parentId)
      .map(c => (
        <div key={c.id} style={{ marginLeft: level * 20 }}>
          <p>{c.author}: {c.content}</p>
          {renderComments(comments, c.id, level + 1)}
        </div>
      ));

  return <div>{renderComments(comments)}</div>;
};

export default CommentList;