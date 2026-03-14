import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const imageUrl = post.image
    ? post.image.startsWith('http') ? post.image : `http://127.0.0.1:8000${post.image}`
    : null;

  const authorInitial = (post.author?.username || post.author || '?')[0].toUpperCase();
  const authorName = post.author?.username || post.author || 'Unknown';

  return (
    <>
      <style>{`
        .post-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #efefef;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .post-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        .post-card:hover .post-card-img {
          transform: scale(1.05);
        }
        .post-card-img {
          transition: transform 0.4s ease;
        }
        .post-card-read-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #1a1a2e;
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: gap 0.2s ease;
        }
        .post-card-read-btn:hover {
          gap: 10px;
          color: #0f3460;
        }
        .post-card-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 3px 10px;
          border-radius: 20px;
          background: #f0efe9;
          color: #666;
        }
      `}</style>

      <div className="post-card shadow-sm">

        {/* Image */}
        <div style={{ overflow: 'hidden', height: '200px', background: '#1a1a2e', flexShrink: 0 }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="post-card-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>✦</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Category + date row */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {post.category ? (
              <span className="post-card-tag">{post.category}</span>
            ) : <span />}
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>

          {/* Title */}
          <h5 style={{
            fontWeight: 800, fontSize: '1rem', lineHeight: 1.4,
            color: '#1a1a2e', marginBottom: '10px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {post.title}
          </h5>

          {/* Excerpt */}
          <p style={{
            fontSize: '0.875rem', color: '#777', lineHeight: 1.7,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            flex: 1, marginBottom: '16px'
          }}>
            {post.content}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #f0f0f0', paddingTop: '14px'
          }}>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {post.author?.profile_pic ? (
                <img
                  src={post.author.profile_pic.startsWith('http')
                    ? post.author.profile_pic
                    : `http://127.0.0.1:8000${post.author.profile_pic}`}
                  alt={authorName}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#1a1a2e', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 700
                }}>
                  {authorInitial}
                </div>
              )}
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#444' }}>{authorName}</span>
            </div>


            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: '#aaa' }}>
                👁 {post.views_count}
              </span>
              <Link to={`/post/${post.slug}`} className="post-card-read-btn">
                Read <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PostCard;
