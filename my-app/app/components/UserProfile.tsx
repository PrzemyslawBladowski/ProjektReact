import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { User, Post } from '../../types';
import { MapPin, Building2, BookOpen, Users, UserPlus, UserMinus, X, Edit } from 'lucide-react';
import { PostCard } from './PostCard';
import { EditProfileDialog } from './EditProfileDialog';
import { useState } from 'react';

interface UserProfileProps {
  user: User;
  posts: Post[];
  currentUser: User;
  onClose: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, content: string, tags: string[]) => void;
  isFollowing: boolean;
  onToggleFollow: (user: User) => void;
  likedPosts?: Set<string>;
  onUpdateProfile?: (updates: Partial<User>) => void;
}

export function UserProfile({
  user,
  posts,
  currentUser,
  onClose,
  onLike,
  onComment,
  onShare,
  onDelete,
  onEdit,
  isFollowing,
  onToggleFollow,
  likedPosts = new Set(),
  onUpdateProfile
}: UserProfileProps) {
  const isOwnProfile = user.id === currentUser.id;
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (onUpdateProfile) {
      onUpdateProfile(updates);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto animate-fade-in">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
              <Button
                onClick={onClose}
                variant="secondary"
                className="absolute top-4 right-4 gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
                Zamknij
              </Button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 mt-16 sm:mt-20">
                  <h1 className="text-gray-900 text-2xl mb-1">{user.name}</h1>
                  <p className="text-gray-600 mb-3">{user.title}</p>
                  
                  {user.bio && (
                    <p className="text-gray-700 mb-4">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 mb-4">
                    {user.institution && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">{user.institution}</span>
                      </div>
                    )}
                    {user.publications !== undefined && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">{user.publications} publikacji</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6 mb-4">
                    <div>
                      <span className="text-gray-600">Obserwujący</span>
                      <span className="ml-2">{user.followers || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Obserwowani</span>
                      <span className="ml-2">{user.following || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Posty</span>
                      <span className="ml-2">{posts.length}</span>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <Button
                      className="gap-2 transition-all hover:scale-105 active:scale-95"
                      variant={isFollowing ? 'outline' : 'default'}
                      onClick={() => onToggleFollow(user)}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Przestań obserwować
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Obserwuj
                        </>
                      )}
                    </Button>
                  )}

                  {isOwnProfile && (
                    <Button
                      className="gap-2 transition-all hover:scale-105 active:scale-95"
                      variant="outline"
                      onClick={() => setShowEditDialog(true)}
                    >
                      <Edit className="w-4 h-4" />
                      Edytuj profil
                    </Button>
                  )}
                </div>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                <h2 className="text-gray-900 text-xl">
                  Posty ({posts.length})
                </h2>
                <div className="animate-stagger">
                  {posts.length > 0 ? (
                    posts.map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUser={currentUser}
                        onLike={onLike}
                        onComment={onComment}
                        onShare={onShare}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        isLiked={likedPosts.has(post.id)}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8 animate-fade-in">
                      Brak postów do wyświetlenia
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {isOwnProfile && (
        <EditProfileDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          user={user}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}