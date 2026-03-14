import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => (
  <div>
    <h3>
      <Link to={`/post/${post.slug}`}>{post.title}</Link>
    </h3>
    <p>Views: {post.views_count} | Likes: {post.likes_count || 0}</p>
  </div>
);

export default PostCard;