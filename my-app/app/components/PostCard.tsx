'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { ShareDialog } from './ShareDialog';
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Edit,
  Plus,
  X,
  Link as LinkIcon
} from 'lucide-react';
import { Post, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onDelete: (postId: string) => void;
  onEdit: (postId: string, content: string, tags: string[]) => void;
  onViewProfile?: (user: User) => void;
  isLiked: boolean;
  isReadOnly?: boolean;
}

export function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
  onShare,
  onDelete,
  onEdit,
  onViewProfile,
  isLiked,
  isReadOnly = false
}: PostCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTags, setEditTags] = useState<string[]>(post.tags);
  const [tagInput, setTagInput] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleShare = (postId: string) => {
    if (isReadOnly) return;
    setShowShareDialog(true);
  };

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
      setIsCommenting(false);
    }
  };

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit(post.id, editContent, editTags);
      setIsEditing(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
      setEditTags([...editTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const isOwnPost = currentUser ? post.author.name === currentUser.name : false;
  const postUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/post/${post.id}` : '';

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => !isReadOnly && onViewProfile?.(post.author)}
              disabled={isReadOnly}
              className={`${!isReadOnly ? 'hover:opacity-80 transition-all hover:scale-105 active:scale-95' : 'cursor-default'}`}
            >
              <Avatar>
                {post.author.avatar ? (
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {post.author.name[0]}
                </AvatarFallback>
              </Avatar>
            </button>
            <div className="flex-1">
              <button
                onClick={() => !isReadOnly && onViewProfile?.(post.author)}
                disabled={isReadOnly}
                className={`text-gray-900 ${!isReadOnly ? 'hover:underline' : 'cursor-default'}`}
              >
                {post.author.name}
              </button>
              <div className="text-gray-500 text-sm">{post.author.title}</div>
              <div className="text-gray-400 text-sm">
                {formatDistanceToNow(post.timestamp, { addSuffix: true, locale: pl })}
              </div>
            </div>
          </div>

          {/* Edit/Delete buttons for own posts */}
          {isOwnPost && !isReadOnly && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-gray-600 hover:text-blue-600 transition-all hover:scale-105 active:scale-95"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edytuj
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="text-gray-600 hover:text-red-600 transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Usuń
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Dodaj tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {editTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editTags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                  setEditTags(post.tags);
                }}
                variant="outline"
              >
                Anuluj
              </Button>
              <Button onClick={handleSaveEdit}>Zapisz</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
            
            {/* Images Grid */}
            {post.images && post.images.length > 0 && (
              <div className={`grid gap-2 mb-4 ${
                post.images.length === 1 ? 'grid-cols-1' :
                post.images.length === 2 ? 'grid-cols-2' :
                'grid-cols-2 md:grid-cols-3'
              }`}>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-4">
        {isReadOnly ? (
          <div className="w-full text-center py-2 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Zaloguj się, aby polubić, komentować i udostępniać posty
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 w-full">
              <Button
                variant={isLiked ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onLike(post.id)}
                className="gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${isLiked ? 'animate-scale-in' : ''}`} />
                {post.likes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCommenting(!isCommenting)}
                className="gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                {post.comments.length}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(post.id)}
                className="gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                {post.shares}
              </Button>
            </div>

            {isCommenting && (
              <div className="w-full animate-slide-up">
                <div className="flex gap-2">
                  <Input
                    placeholder="Dodaj komentarz..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        onComment(post.id, newComment);
                        setNewComment('');
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      if (newComment.trim()) {
                        onComment(post.id, newComment);
                        setNewComment('');
                      }
                    }}
                    size="sm"
                  >
                    Wyślij
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {post.comments.length > 0 && (
          <div className="w-full animate-fade-in">
            <div className="space-y-3">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                    <div className="text-gray-900 text-sm">{comment.author.name}</div>
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="text-gray-400 text-sm mt-1">
                      {formatDistanceToNow(comment.timestamp, { addSuffix: true, locale: pl })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        postContent={post.content}
        postUrl={postUrl}
      />
    </Card>
  );
}