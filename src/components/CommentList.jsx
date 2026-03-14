import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns'; // npm install date-fns

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
        <div
          key={c.id}
          style={{
            marginLeft: level * 20,
            borderLeft: level > 0 ? '1px solid #ccc' : 'none',
            paddingLeft: level > 0 ? 10 : 0,
            marginTop: 8
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{c.author}</strong> ·{" "}
            <span style={{ color: "#777", fontSize: "0.85em" }}>
              {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
            </span>
          </p>
          <p style={{ margin: "2px 0 8px 0" }}>{c.content}</p>
          {renderComments(comments, c.id, level + 1)}
        </div>
      ));

  return <div>{renderComments(comments)}</div>;
};

export default CommentList;