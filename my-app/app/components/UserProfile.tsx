import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { User, Post } from '../../types';
import { MapPin, Building2, BookOpen, Users, UserPlus, UserMinus, X, Edit, ChevronDown } from 'lucide-react';
import { PostCard } from './PostCard';
import { EditProfileDialog } from './EditProfileDialog';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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
  followedUsers?: User[];
  onViewProfile?: (user: User) => void;
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
  onUpdateProfile,
  followedUsers = [],
  onViewProfile
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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
                <span>Zamknij</span>
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 bg-white">
              <div className="flex flex-col sm:flex-row gap-6 -mt-16 mb-6">
                <Avatar className="w-32 h-32 border-4 border-blue-100 bg-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-3xl bg-gray-200 text-gray-900">{user.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 mt-16 sm:mt-20">
                  <h1 className="text-gray-900 text-3xl font-bold mb-2">{user.name}</h1>
                  <p className="text-gray-900 text-lg font-medium mb-3">{user.title}</p>
                  
                  <p className="text-gray-700 mb-5 text-base">Nowy członek społeczności naukowej</p>

                  <div className="flex flex-wrap gap-4 mb-5">
                    {user.institution && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <span className="text-base font-medium">{user.institution}</span>
                      </div>
                    )}
                    {user.publications !== undefined && (
                      <div className="flex items-center gap-2 text-gray-900">
                        <BookOpen className="w-5 h-5 text-gray-600" />
                        <span className="text-base font-medium">{user.publications} publikacji</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6 mb-5 text-gray-900 text-base font-medium">
                    <div>
                      <span>Obserwujący</span>
                      <span className="ml-2 font-semibold">{user.followers || 0}</span>
                    </div>
                    {isOwnProfile && followedUsers.length > 0 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                            <span>Obserwowani</span>
                            <span className="ml-2 font-semibold">{followedUsers.length}</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64 bg-white border border-gray-200 shadow-lg">
                          <div className="p-2">
                            <div className="text-xs text-gray-500 px-2 py-1 mb-1 font-semibold">
                              Obserwowani użytkownicy
                            </div>
                            {followedUsers.map((followedUser) => (
                              <DropdownMenuItem
                                key={followedUser.id}
                                onClick={() => {
                                  if (onViewProfile) {
                                    onViewProfile(followedUser);
                                  }
                                }}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer focus:bg-gray-50"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={followedUser.avatar} alt={followedUser.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                                    {followedUser.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {followedUser.name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {followedUser.title}
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <div>
                        <span>Obserwowani</span>
                        <span className="ml-2 font-semibold">{user.following || 0}</span>
                      </div>
                    )}
                    <div>
                      <span>Posty</span>
                      <span className="ml-2 font-semibold">{posts.length}</span>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <Button
                      className={`gap-2 transition-colors duration-200 ${
                        isFollowing
                          ? 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
                          : 'bg-blue-600 hover:bg-blue-700 text-white border-0'
                      }`}
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
                      className="gap-2 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors duration-200"
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
                <h2 className="text-gray-900 text-xl font-semibold">
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