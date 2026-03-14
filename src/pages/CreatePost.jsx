import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const CreatePost = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

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

    API.post("api/posts/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => navigate(`/post/${res.data.slug}`))
      .catch((err) => {
        console.error(err);
        setError("Failed to create post. Make sure you are logged in.");
      })
      .finally(() => setSaving(false));
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: "750px" }}>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            padding: '24px 32px'
          }}>
            <h4 className="text-white fw-bold mb-0">✍️ Write a New Post</h4>
            <p className="text-white-50 small mb-0 mt-1">Share your thoughts with the world</p>
          </div>

          <div className="card-body p-4">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

              {/* Title */}
              <div className="mb-4">
                <label className="form-label fw-semibold small text-uppercase text-muted">Title</label>
                <input
                  type="text"
                  className="form-control form-control-lg border-0 bg-light"
                  placeholder="Give your post a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{ fontSize: '1.1rem' }}
                />
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="form-label fw-semibold small text-uppercase text-muted">Content</label>
                <textarea
                  className="form-control border-0 bg-light"
                  rows="12"
                  placeholder="Write your post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  style={{ resize: 'vertical', lineHeight: '1.8' }}
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="form-label fw-semibold small text-uppercase text-muted">Cover Image</label>

                {/* Preview */}
                {imagePreview && (
                  <div className="mb-3 position-relative" style={{ display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{
                        width: '100%', maxHeight: '220px',
                        objectFit: 'cover', borderRadius: '10px'
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-dark position-absolute"
                      style={{ top: 8, right: 8, borderRadius: '50%', padding: '2px 7px' }}
                      onClick={() => { setImage(null); setImagePreview(null); }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div
                  className="bg-light rounded-3 text-center py-4 px-3"
                  style={{ border: '2px dashed #dee2e6', cursor: 'pointer' }}
                  onClick={() => document.getElementById('imageInput').click()}
                >
                  <p className="mb-1 text-muted">📷 Click to upload a cover image</p>
                  <p className="small text-muted mb-0">JPG, PNG, WEBP supported</p>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 pt-2">
                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  disabled={saving}
                >
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Publishing...</>
                  ) : (
                    '🚀 Publish Post'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
