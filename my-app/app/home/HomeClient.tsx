'use client';

import { useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { CreatePost } from '../components/CreatePost';
import { PostFeed } from '../components/PostFeed';
import { UserProfile } from '../components/UserProfile';
import { AuthScreen } from '../components/AuthScreen';
import { Post, User } from '../../types';
import { censorProfanity } from '../../lib/profanityFilter';
import {
  addRemoteComment,
  createRemotePost,
  deleteRemotePost,
  registerRemoteShare,
  toggleRemoteLike,
  updateRemotePost,
  updateRemoteUser,
} from '../../lib/api';

interface HomeClientProps {
  initialPosts: Post[];
}

export function HomeClient({ initialPosts }: HomeClientProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    category: 'all',
    sortBy: 'recent',
    dateRange: 'all',
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [posts]);

  const updatePostInList = (updatedPost: Post) => {
    setPosts(prev =>
      prev.map(post => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  const showError = (message: string, error?: unknown) => {
    console.error(message, error);
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleCreatePost = async (content: string, tags: string[], images: string[]) => {
    if (!currentUser) {
      showError('Zaloguj się, aby dodać post.');
      return;
    }

    try {
      const sanitizedContent = censorProfanity(content);
      const newPost = await createRemotePost({
        authorId: currentUser.id,
        content: sanitizedContent,
        tags,
        images,
      });
      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      showError('Nie udało się utworzyć posta.', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteRemotePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      setLikedPosts(prev => {
        const cloned = new Set(prev);
        cloned.delete(postId);
        return cloned;
      });
    } catch (error) {
      showError('Nie udało się usunąć posta.', error);
    }
  };

  const handleEditPost = async (postId: string, newContent: string, newTags: string[]) => {
    try {
      const sanitized = censorProfanity(newContent);
      const updatedPost = await updateRemotePost(postId, {
        content: sanitized,
        tags: newTags,
      });
      updatePostInList(updatedPost);
    } catch (error) {
      showError('Nie udało się zaktualizować posta.', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      showError('Zaloguj się, aby polubić post.');
      return;
    }

    const alreadyLiked = likedPosts.has(postId);
    try {
      const updated = await toggleRemoteLike({
        postId,
        action: alreadyLiked ? 'unlike' : 'like',
      });
      updatePostInList(updated);
      setLikedPosts(prev => {
        const cloned = new Set(prev);
        if (alreadyLiked) {
          cloned.delete(postId);
        } else {
          cloned.add(postId);
        }
        return cloned;
      });
    } catch (error) {
      showError('Nie udało się zmienić stanu polubienia.', error);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    if (!currentUser) {
      showError('Zaloguj się, aby komentować.');
      return;
    }

    try {
      const sanitized = censorProfanity(comment);
      const updated = await addRemoteComment({
        postId,
        authorId: currentUser.id,
        content: sanitized,
      });
      updatePostInList(updated);
    } catch (error) {
      showError('Nie udało się dodać komentarza.', error);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const updated = await registerRemoteShare({ postId });
      updatePostInList(updated);
    } catch (error) {
      showError('Nie udało się zarejestrować udostępnienia.', error);
    }
  };

  const handleViewProfile = (user: User) => {
    if (!currentUser) {
      showError('Zaloguj się, aby przeglądać profile.');
      return;
    }
    setSelectedUser(user);
  };

  const handleToggleFollow = (user: User) => {
    setFollowedUsers(prev => {
      const cloned = new Set(prev);
      if (cloned.has(user.id)) {
        cloned.delete(user.id);
      } else {
        cloned.add(user.id);
      }
      return cloned;
    });
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;

    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.bio) {
      sanitizedUpdates.bio = censorProfanity(sanitizedUpdates.bio);
    }

    try {
      const updatedUser = await updateRemoteUser(currentUser.id, sanitizedUpdates);
      setCurrentUser(updatedUser);
      setPosts(prev =>
        prev.map(post =>
          post.author.id === updatedUser.id ? { ...post, author: updatedUser } : post,
        ),
      );
      if (selectedUser && selectedUser.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
    } catch (error) {
      showError('Nie udało się zaktualizować profilu.', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLikedPosts(new Set());
    setFollowedUsers(new Set());
    setShowAuth(false);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    const query = (searchQuery || searchFilters.query).toLowerCase();
    if (query) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => post.tags.some(tag => selectedTags.includes(tag)));
    }

    if (searchFilters.category !== 'all') {
      const categoryMap: Record<string, string[]> = {
        physics: ['Fizyka', 'Fizyka Kwantowa'],
        biology: ['Biologia', 'Biotechnologia'],
        chemistry: ['Chemia'],
        ai: ['AI', 'Machine Learning', 'Technologia'],
        medicine: ['Medycyna', 'CRISPR'],
      };
      const categoryTags = categoryMap[searchFilters.category] || [];
      filtered = filtered.filter(post =>
        post.tags.some(tag => categoryTags.some(ct => tag.includes(ct))),
      );
    }

    if (searchFilters.dateRange !== 'all') {
      const now = new Date();
      const ranges: Record<string, number> = {
        today: 1,
        week: 7,
        month: 30,
        year: 365,
      };
      const days = ranges[searchFilters.dateRange];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(post => post.timestamp >= cutoff);
      }
    }

    const sorted = [...filtered];
    switch (searchFilters.sortBy) {
      case 'popular':
        sorted.sort((a, b) => b.likes - a.likes);
        break;
      case 'discussed':
        sorted.sort((a, b) => b.comments.length - a.comments.length);
        break;
      case 'recent':
      default:
        sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    return sorted;
  }, [posts, searchQuery, searchFilters, selectedTags]);

  const userPosts = selectedUser
    ? posts.filter(post => post.author.id === selectedUser.id)
    : [];

  if (showAuth) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <AuthScreen
          onLogin={handleLogin}
          onBack={() => setShowAuth(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        availableTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={tag =>
          setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
          )
        }
        onSearch={setSearchFilters}
        posts={posts}
        onViewProfile={currentUser ? handleViewProfile : undefined}
        onLogout={currentUser ? handleLogout : undefined}
        onShowAuth={() => setShowAuth(true)}
      />

      {statusMessage && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {statusMessage}
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {currentUser && (
          <div className="animate-slide-up">
            <CreatePost onCreatePost={handleCreatePost} />
          </div>
        )}

        <PostFeed
          posts={filteredPosts}
          currentUser={currentUser}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
          onViewProfile={currentUser ? handleViewProfile : undefined}
          likedPosts={likedPosts}
          isReadOnly={!currentUser}
        />
      </main>

      {selectedUser && currentUser && (
        <UserProfile
          user={selectedUser.id === currentUser.id ? currentUser : selectedUser}
          posts={userPosts}
          currentUser={currentUser}
          onClose={() => setSelectedUser(null)}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
          isFollowing={followedUsers.has(selectedUser.id)}
          onToggleFollow={() => handleToggleFollow(selectedUser)}
          likedPosts={likedPosts}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}

