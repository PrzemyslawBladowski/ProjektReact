'use client';

import { PostCard } from './PostCard';
import { Post, User } from '../../types';

interface PostFeedProps {
  posts: Post[];
  currentUser: User | null;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, content: string, tags: string[]) => void;
  onViewProfile?: (user: User) => void;
  likedPosts: Set<string>;
  isReadOnly?: boolean;
}

export function PostFeed({ posts, currentUser, onLike, onComment, onShare, onDelete, onEdit, onViewProfile, likedPosts, isReadOnly = false }: PostFeedProps) {
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