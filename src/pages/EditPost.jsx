import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch post detail using slug from the list endpoint
    API.get(`api/posts/`)
      .then((res) => {
        const posts = Array.isArray(res.data)
          ? res.data
          : res.data.results ?? [];
        const post = posts.find((p) => p.id === parseInt(id));
        if (!post) {
          setError("Post not found.");
          return;
        }
        setTitle(post.title);
        setContent(post.content);
        setCurrentImage(post.image || null);
        setSlug(post.slug);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load post.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("is_published", true);
    if (image) formData.append("image", image);

    API.put(`api/posts/update/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
.then((res) => {
  console.log("Updated post:", res.data); // check slug here
  navigate(`/post/${res.data.slug}`);
})
      .catch((err) => {
        console.error(err);
        setError("Failed to update post.");
      })
      .finally(() => setSaving(false));
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "700px" }}>
        <h2 className="mb-4">Edit Post</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Content</label>
            <textarea
              className="form-control"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Image</label>
            {currentImage && (
              <div className="mb-2">
                <img
                  src={
                    currentImage.startsWith("http")
                      ? currentImage
                      : `http://127.0.0.1:8000${currentImage}`
                  }
                  alt="Current"
                  style={{ height: "150px", objectFit: "cover", borderRadius: "8px" }}
                />
                <p className="text-muted small mt-1">
                  Current image — upload a new one to replace it
                </p>
              </div>
            )}
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-dark" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/post/${slug}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPost;
