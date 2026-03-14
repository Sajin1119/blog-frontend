import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import LikeButton from '../components/LikeButton';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    API.get(`posts/${slug}/`)
      .then(res => setPost(res.data))
      .catch(err => console.log(err));
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Views: {post.views_count}</p>
      <LikeButton postId={post.id} />
      <CommentList postId={post.id} />
      <CommentForm postId={post.id} />
    </div>
  );
};

export default PostDetail;