import { PostCard } from './PostCard';

export function PostFeed({ posts, currentUser, onLike, onComment, onShare, onDelete, onEdit, onViewProfile, likedPosts, isReadOnly = false }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Brak postów do wyświetlenia</p>
        <p className="text-sm mt-2">Spróbuj zmienić filtry wyszukiwania</p>
      </div>
    );
  }

  return (
    <div className="animate-stagger">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onDelete={onDelete}
          onEdit={onEdit}
          onViewProfile={onViewProfile}
          isLiked={likedPosts.has(post.id)}
          isReadOnly={isReadOnly}
        />
      ))}
    </div>
  );
}
