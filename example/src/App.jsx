import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CreatePost } from './components/CreatePost';
import { PostFeed } from './components/PostFeed';
import { UserProfile } from './components/UserProfile';
import { AuthScreen } from './components/AuthScreen';
import { Button } from './components/ui/button';
import { LogOut } from 'lucide-react';
import { censorProfanity } from './lib/profanityFilter';

// Przykładowe dane użytkowników z rozszerzonymi profilami
const users = [
  {
    name: 'Dr Anna Kowalska',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    title: 'Profesor Fizyki Kwantowej',
    bio: 'Specjalizuję się w teorii kwantowej i jej praktycznych zastosowaniach. Jestem pasjonatką edukacji naukowej i popularyzacji nauki.',
    institution: 'Uniwersytet Warszawski',
    publications: 47,
    followers: 1250,
    following: 320
  },
  {
    name: 'Prof. Jan Nowak',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    title: 'Kierownik Katedry Biotechnologii',
    bio: 'Badacz w dziedzinie biotechnologii i inżynierii genetycznej. Prowadzę zespół badawczy zajmujący się terapiami genowymi.',
    institution: 'Politechnika Gdańska',
    publications: 89,
    followers: 2100,
    following: 450
  },
  {
    name: 'Dr Katarzyna Wiśniewska',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    title: 'Badaczka AI i Machine Learning',
    bio: 'Zajmuję się sztuczną inteligencją, uczeniem maszynowym i ich zastosowaniami w modelowaniu klimatu.',
    institution: 'AGH Kraków',
    publications: 34,
    followers: 980,
    following: 210
  }
];

// Przykładowe dane postów naukowych
const initialPosts = [
  {
    id: '1',
    author: users[0],
    content: 'Najnowsze odkrycia w dziedzinie splątania kwantowego pokazują, że możemy osiągnąć kwantową supremację w praktycznych zastosowaniach obliczeniowych. Nasze badania wskazują na 40% poprawę efektywności w porównaniu do dotychczasowych metod.',
    timestamp: new Date('2024-11-15T10:30:00'),
    likes: 127,
    comments: [],
    shares: 23,
    tags: ['Fizyka Kwantowa', 'Badania', 'Technologia'],
    images: ['https://images.unsplash.com/photo-1755455840466-85747052a634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwcGh5c2ljcyUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzYzMzcwMzE2fDA&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: '2',
    author: users[1],
    content: 'Przełomowe wyniki w terapii genowej CRISPR-Cas9. Nasza drużyna badawcza z powodzeniem zastosowała edycję genów do leczenia rzadkich chorób genetycznych. Publikacja w Nature już dostępna! 🧬',
    timestamp: new Date('2024-11-14T14:20:00'),
    likes: 243,
    comments: [],
    shares: 56,
    tags: ['Biotechnologia', 'CRISPR', 'Medycyna'],
    images: ['https://images.unsplash.com/photo-1676206584909-c373cf61cefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkbmElMjBoZWxpeCUyMG1vbGVjdWxhcnxlbnwxfHx8fDE3NjMzNzAzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: '3',
    author: users[2],
    content: 'Nasz nowy model sztucznej inteligencji do przewidywania zmian klimatycznych osiągnął dokładność 94%. Wykorzystaliśmy dane z ostatnich 50 lat i najnowsze algorytmy deep learning.',
    timestamp: new Date('2024-11-16T09:15:00'),
    likes: 189,
    comments: [],
    shares: 34,
    tags: ['AI', 'Klimat', 'Machine Learning']
  },
  {
    id: '4',
    author: users[0],
    content: 'Nowe badania nad komputerami kwantowymi w laboratorium. Testujemy różne konfiguracje qubitów.',
    timestamp: new Date('2024-11-17T08:00:00'),
    likes: 56,
    comments: [],
    shares: 12,
    tags: ['Fizyka Kwantowa', 'Laboratorium'],
    images: ['https://images.unsplash.com/photo-1614308457932-e16d85c5d053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwbWljcm9zY29wZSUyMHNjaWVuY2V8ZW58MXx8fHwxNzYzMzcwMzE1fDA&ixlib=rb-4.1.0&q=80&w=1080']
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    category: 'all',
    sortBy: 'recent',
    dateRange: 'all'
  });
  
  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [posts]);

  const handleCreatePost = (content, tags, images) => {
    const censoredContent = censorProfanity(content);
    const newPost = {
      id: Date.now().toString(),
      author: currentUser,
      content: censoredContent,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      tags,
      images
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleEditPost = (postId, newContent, newTags) => {
    const censoredContent = censorProfanity(newContent);
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, content: censoredContent, tags: newTags }
        : post
    ));
  };

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    
    if (newLikedPosts.has(postId)) {
      // Unlike
      newLikedPosts.delete(postId);
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likes: Math.max(0, post.likes - 1) }
          : post
      ));
    } else {
      // Like
      newLikedPosts.add(postId);
      setPosts(posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    }
    
    setLikedPosts(newLikedPosts);
  };

  const handleComment = (postId, comment) => {
    const censoredComment = censorProfanity(comment);
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now().toString(),
                author: currentUser,
                content: censoredComment,
                timestamp: new Date()
              }
            ]
          }
        : post
    ));
  };

  const handleShare = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  const handleViewProfile = (user) => {
    if (!currentUser) return; // Prevent action if not logged in
    setSelectedUser(user);
  };

  const handleToggleFollow = (user) => {
    const userName = user.name;
    const newFollowedUsers = new Set(followedUsers);
    
    if (newFollowedUsers.has(userName)) {
      newFollowedUsers.delete(userName);
    } else {
      newFollowedUsers.add(userName);
    }
    
    setFollowedUsers(newFollowedUsers);
  };

  const handleUpdateProfile = (updates) => {
    if (currentUser) {
      // Censor bio if it's being updated
      const censoredUpdates = { ...updates };
      if (updates.bio) {
        censoredUpdates.bio = censorProfanity(updates.bio);
      }
      
      const updatedUser = { ...currentUser, ...censoredUpdates };
      setCurrentUser(updatedUser);
      
      // Update posts with new user info
      setPosts(posts.map(post => 
        post.author.name === currentUser.name
          ? { ...post, author: updatedUser }
          : post
      ));
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLikedPosts(new Set());
    setFollowedUsers(new Set());
    setShowAuth(false);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  // Filter and sort posts based on search criteria
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Text search
    const query = (searchQuery || searchFilters.query).toLowerCase();
    if (query) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => selectedTags.includes(tag))
      );
    }

    // Category filter
    if (searchFilters.category !== 'all') {
      const categoryMap = {
        physics: ['Fizyka', 'Fizyka Kwantowa'],
        biology: ['Biologia', 'Biotechnologia'],
        chemistry: ['Chemia'],
        ai: ['AI', 'Machine Learning', 'Technologia'],
        medicine: ['Medycyna', 'CRISPR']
      };
      
      const categoryTags = categoryMap[searchFilters.category] || [];
      filtered = filtered.filter(post =>
        post.tags.some(tag => categoryTags.some(ct => tag.includes(ct)))
      );
    }

    // Date range filter
    if (searchFilters.dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        today: 1,
        week: 7,
        month: 30,
        year: 365
      };
      const days = ranges[searchFilters.dateRange];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(post => post.timestamp >= cutoff);
      }
    }

    // Sort
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

  // Get user's posts for profile view
  const userPosts = selectedUser
    ? posts.filter(post => post.author.name === selectedUser.name)
    : [];

  // Show auth screen as modal if requested
  if (showAuth) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <AuthScreen onLogin={handleLogin} onBack={() => setShowAuth(false)} />
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
        onTagToggle={handleTagToggle}
        onSearch={handleSearch}
        posts={posts}
        onViewProfile={currentUser ? handleViewProfile : undefined}
        onLogout={currentUser ? handleLogout : undefined}
        onShowAuth={() => setShowAuth(true)}
      />
      
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

      {/* User Profile Modal */}
      {selectedUser && currentUser && (
        <UserProfile
          user={selectedUser.name === currentUser.name ? currentUser : selectedUser}
          posts={userPosts}
          currentUser={currentUser}
          onClose={() => setSelectedUser(null)}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
          isFollowing={followedUsers.has(selectedUser.name)}
          onToggleFollow={() => handleToggleFollow(selectedUser)}
          likedPosts={likedPosts}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
