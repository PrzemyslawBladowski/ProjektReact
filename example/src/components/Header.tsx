import { useState, useEffect, useRef } from 'react';
import { Search, Microscope, Filter, X, Hash, User as UserIcon, FileText, LogOut, UserCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { User, Post } from '../types';

interface SearchFilters {
  query: string;
  category: string;
  sortBy: string;
  dateRange: string;
}

interface SearchSuggestion {
  type: 'tag' | 'author' | 'content';
  value: string;
  icon: React.ReactNode;
}

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: User | null;
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onSearch: (filters: SearchFilters) => void;
  posts: Post[];
  onViewProfile?: (user: User) => void;
  onLogout?: () => void;
  onShowAuth?: () => void;
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  currentUser,
  availableTags,
  selectedTags,
  onTagToggle,
  onSearch,
  posts,
  onViewProfile,
  onLogout,
  onShowAuth
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    sortBy: 'recent',
    dateRange: 'all'
  });

  // Generate suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Tag suggestions
    const matchingTags = availableTags
      .filter(tag => tag.toLowerCase().includes(query))
      .slice(0, 3);
    matchingTags.forEach(tag => {
      newSuggestions.push({
        type: 'tag',
        value: tag,
        icon: <Hash className="w-4 h-4" />
      });
    });

    // Author suggestions
    const uniqueAuthors = Array.from(new Set(posts.map(p => p.author.name)));
    const matchingAuthors = uniqueAuthors
      .filter(author => author.toLowerCase().includes(query))
      .slice(0, 3);
    matchingAuthors.forEach(author => {
      newSuggestions.push({
        type: 'author',
        value: author,
        icon: <UserIcon className="w-4 h-4" />
      });
    });

    // Content suggestions (first few words from matching posts)
    const matchingPosts = posts
      .filter(post => post.content.toLowerCase().includes(query))
      .slice(0, 2);
    matchingPosts.forEach(post => {
      const snippet = post.content.substring(0, 50) + '...';
      newSuggestions.push({
        type: 'content',
        value: snippet,
        icon: <FileText className="w-4 h-4" />
      });
    });

    setSuggestions(newSuggestions.slice(0, 8));
    setShowSuggestions(newSuggestions.length > 0);
  }, [searchQuery, availableTags, posts]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyFilters = () => {
    onSearch({ ...filters, query: searchQuery });
    setShowSuggestions(false);
  };

  const handleResetFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      sortBy: 'recent',
      dateRange: 'all'
    });
    onSearchChange('');
    onSearch({
      query: '',
      category: 'all',
      sortBy: 'recent',
      dateRange: 'all'
    });
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'tag') {
      onTagToggle(suggestion.value);
    } else if (suggestion.type === 'author' || suggestion.type === 'content') {
      onSearchChange(suggestion.value);
    }
    setShowSuggestions(false);
    handleApplyFilters();
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.sortBy !== 'recent' || 
    filters.dateRange !== 'all' ||
    selectedTags.length > 0;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-900 hidden sm:block">ScienceHub</span>
          </div>

          {/* Search Bar with Filters */}
          <div className="flex-1 max-w-2xl" ref={searchRef}>
            <div className="space-y-3 relative">
              {/* Main Search Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Szukaj postów, autorów, tagów..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleApplyFilters();
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      }
                    }}
                    className="pl-10 pr-4"
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                      <div className="p-2">
                        <div className="text-xs text-gray-500 px-2 py-1 mb-1">
                          Podpowiedzi
                        </div>
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded text-left transition-colors"
                          >
                            <div className="text-gray-500">
                              {suggestion.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-900 truncate">
                                {suggestion.value}
                              </div>
                              <div className="text-xs text-gray-500">
                                {suggestion.type === 'tag' && 'Tag'}
                                {suggestion.type === 'author' && 'Autor'}
                                {suggestion.type === 'content' && 'Treść posta'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <Filter className="w-5 h-5" />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </Button>
              </div>

              {/* Advanced Filters Dropdown */}
              {showFilters && (
                <div className="bg-white border rounded-lg shadow-lg p-4 space-y-4 absolute left-0 right-0 mt-2 z-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-900">Filtry wyszukiwania</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm mb-1 block">Kategoria</Label>
                      <Select
                        value={filters.category}
                        onValueChange={(value) => setFilters({ ...filters, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Wszystkie</SelectItem>
                          <SelectItem value="physics">Fizyka</SelectItem>
                          <SelectItem value="biology">Biologia</SelectItem>
                          <SelectItem value="chemistry">Chemia</SelectItem>
                          <SelectItem value="ai">AI & Technologia</SelectItem>
                          <SelectItem value="medicine">Medycyna</SelectItem>
                          <SelectItem value="other">Inne</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm mb-1 block">Sortuj według</Label>
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Najnowsze</SelectItem>
                          <SelectItem value="popular">Najpopularniejsze</SelectItem>
                          <SelectItem value="discussed">Najczęściej komentowane</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm mb-1 block">Zakres dat</Label>
                      <Select
                        value={filters.dateRange}
                        onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Wszystkie</SelectItem>
                          <SelectItem value="today">Dzisiaj</SelectItem>
                          <SelectItem value="week">Ostatni tydzień</SelectItem>
                          <SelectItem value="month">Ostatni miesiąc</SelectItem>
                          <SelectItem value="year">Ostatni rok</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tag Filters */}
                  {availableTags.length > 0 && (
                    <div>
                      <Label className="text-sm mb-2 block">Filtruj po tagach</Label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {availableTags.map(tag => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => onTagToggle(tag)}
                          >
                            {tag}
                            {selectedTags.includes(tag) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button onClick={handleApplyFilters} className="flex-1">
                      <Search className="w-4 h-4 mr-2" />
                      Szukaj
                    </Button>
                    <Button onClick={handleResetFilters} variant="outline">
                      Resetuj
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Profile or Auth Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none">
                    <div className="text-right hidden md:block">
                      <div className="text-gray-900">{currentUser.name}</div>
                      <div className="text-gray-500 text-sm">{currentUser.title}</div>
                    </div>
                    <Avatar className="ring-2 ring-blue-100 hover:ring-blue-300 transition-all cursor-pointer">
                      {currentUser.avatar ? (
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {currentUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.title}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onViewProfile?.(currentUser)}>
                    <UserCircle className="w-4 h-4 mr-2" />
                    Mój profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Wyloguj się
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowAuth}
                  className="gap-2"
                >
                  <UserCircle className="w-4 h-4" />
                  Logowanie
                </Button>
                <Button
                  size="sm"
                  onClick={onShowAuth}
                  className="gap-2"
                >
                  Rejestracja
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}