import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Avatar = ({ user, size = 40 }) => {
  const picUrl = user?.profile_pic
    ? user.profile_pic.startsWith("http")
      ? user.profile_pic
      : `http://127.0.0.1:8000${user.profile_pic}`
    : null;

  const initial = (user?.username || "?")[0].toUpperCase();

  return picUrl ? (
    <img
      src={picUrl}
      alt={user.username}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#1a1a2e",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
};

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get(`api/posts/${slug}/`)
      .then((res) => {
        setPost(res.data);
        fetchComments(res.data.id);
      })
      .catch((err) => {
        console.error("Failed to load post:", err);
        setError("Failed to load post.");
      });
  }, [slug]);

  const fetchComments = (postId) => {
    setLoadingComments(true);
    API.get(`api/comments/post/${postId}/`)
      .then((res) => {
        const data = res.data;
        const list = Array.isArray(data)
          ? data
          : data.results ?? data.comments ?? [];
        setComments(list);
      })
      .catch((err) => console.error("Failed to load comments:", err))
      .finally(() => setLoadingComments(false));
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this post?")) return;
    API.delete(`api/posts/delete/${post.slug}/`)
      .then(() => { alert("Post deleted"); navigate("/"); })
      .catch((err) => console.error("Failed to delete post:", err));
  };

  const handleComment = () => {
    if (!comment.trim() || !post) return;
    setPostingComment(true);
    API.post(`api/comments/post/${post.id}/`, { content: comment })
      .then((res) => {
        const data = res.data;
        const newComment = data.comment ?? data;
        setComments((prev) => [...prev, newComment]);
        setComment("");
      })
      .catch((err) => console.error("Failed to post comment:", err))
      .finally(() => setPostingComment(false));
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
      API.delete(`api/comments/delete/${commentId}/`)
      .then(() => setComments((prev) => prev.filter((c) => c.id !== commentId)))
      .catch((err) => console.error("Failed to delete comment:", err));
  };

  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!post) return <p className="text-center mt-5">Loading...</p>;

  const isAuthor = user && user.username === post.author?.username;

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "800px" }}>

        {/* Post Image */}
        {post.image && (
          <img
            src={post.image.startsWith("http") ? post.image : `http://127.0.0.1:8000${post.image}`}
            alt={post.title}
            className="img-fluid rounded mb-4"
            style={{ width: "100%", maxHeight: "420px", objectFit: "cover" }}
          />
        )}

        {/* Title */}
        <h1 className="mb-3">{post.title}</h1>

        {/* Author Row */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <Avatar user={post.author} size={46} />
          <div>
            <Link to={`/user/${post.author?.username}`} style={{ fontWeight: 600, color: '#1a1a2e', textDecoration: 'none' }}>{post.author?.username}</Link>
            <div className="text-muted small">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </div>
          </div>
          {post.category && (
            <span className="badge bg-dark ms-auto">{post.category}</span>
          )}
        </div>

        {/* Stats */}
        <div className="text-muted mb-4 small">
          👁 {post.views_count} views · ❤️ {post.likes_count} likes
        </div>

        {/* Content */}
        <p style={{ lineHeight: "1.9", fontSize: "1.05rem" }}>{post.content}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-3 mb-2">
            {post.tags.map((tag) => (
              <span key={tag} className="badge bg-secondary me-1">{tag}</span>
            ))}
          </div>
        )}

        {/* Author Controls */}
        {isAuthor && (
          <div className="mt-4 d-flex gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate(`/edit/${post.id}`)}
            >
              ✏️ Edit
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
              🗑 Delete
            </button>
          </div>
        )}

        <hr className="my-5" />

        {/* Comments Section */}
        <h5 className="mb-4 fw-bold">
          💬 Comments {comments.length > 0 && <span className="text-muted fw-normal">({comments.length})</span>}
        </h5>

        {/* Comment Form */}
        {user ? (
          <div className="d-flex gap-3 mb-4">
            <Avatar user={user} size={38} />
            <div className="flex-grow-1">
              <textarea
                className="form-control mb-2"
                rows="2"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="btn btn-dark btn-sm"
                onClick={handleComment}
                disabled={postingComment}
              >
                {postingComment ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-muted mb-4">
            <a href="/login" className="text-dark fw-semibold">Login</a> to write a comment
          </p>
        )}

        {/* Comment List */}
        {loadingComments ? (
          <p className="text-muted">Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((c) => {
            const commentAuthor = typeof c.author === "object" ? c.author : { username: c.author };
            const isCommentOwner = user && user.username === commentAuthor.username;

            return (
              <div key={c.id} className="d-flex gap-3 mb-4">
                <Avatar user={commentAuthor} size={38} />
                <div className="flex-grow-1">
                  <div className="bg-light rounded p-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold">{commentAuthor.username}</span>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted">
                          {new Date(c.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric"
                          })}
                        </small>
                        {isCommentOwner && (
                          <button
                            className="btn btn-sm btn-outline-danger py-0 px-2"
                            style={{ fontSize: "0.75em" }}
                            onClick={() => handleDeleteComment(c.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mb-0">{c.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted">No comments yet. Be the first!</p>
        )}
      </div>
    </>
  );
};

export default PostDetail;
