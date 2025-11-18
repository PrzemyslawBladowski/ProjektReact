'use client';

import { useMemo, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { Post } from "../../types";

interface ClientPostCardProps {
  posts: Post[];
}

export function ClientPostCard({ posts }: ClientPostCardProps) {
  const [activePostId, setActivePostId] = useState(posts[0]?.id ?? "");
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});
  const [localShares, setLocalShares] = useState<Record<string, number>>({});

  const activePost = useMemo(
    () => posts.find(post => post.id === activePostId) ?? posts[0],
    [activePostId, posts],
  );

  if (!activePost) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
        Brak postów do wyświetlenia.
      </div>
    );
  }

  const currentLikes = localLikes[activePost.id] ?? activePost.likes;
  const currentShares = localShares[activePost.id] ?? activePost.shares;
  const avatarSrc =
    activePost.author.avatar ||
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop";

  const handleLocalLike = () => {
    setLocalLikes(prev => ({
      ...prev,
      [activePost.id]: currentLikes + 1,
    }));
  };

  const handleLocalShare = () => {
    setLocalShares(prev => ({
      ...prev,
      [activePost.id]: currentShares + 1,
    }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
      <article className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={avatarSrc}
            alt={activePost.author.name}
            className="w-16 h-16 rounded-2xl object-cover border border-blue-100"
          />
          <div>
            <p className="text-sm text-blue-600 font-semibold">{activePost.author.title}</p>
            <h2 className="text-2xl font-semibold text-gray-900">{activePost.author.name}</h2>
            <p className="text-gray-500 text-sm">{activePost.author.institution}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {activePost.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed">{activePost.content}</p>
        </div>

        <div className="flex gap-4">
          <button
            className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={handleLocalLike}
          >
            <Heart className="w-5 h-5" />
            Polub ({currentLikes})
          </button>
          <button
            className="flex-1 bg-purple-50 text-purple-700 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 border border-purple-100 hover:bg-purple-100 transition-colors"
            onClick={handleLocalShare}
          >
            <Share2 className="w-5 h-5" />
            Udostępnij ({currentShares})
          </button>
        </div>
      </article>

      <aside className="bg-white rounded-3xl shadow p-6 border border-gray-100">
        <p className="text-sm uppercase text-gray-500 tracking-widest">Posty w kolejce</p>
        <div className="mt-4 space-y-3">
          {posts.map(post => (
            <button
              key={post.id}
              onClick={() => setActivePostId(post.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                post.id === activePost.id
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <p className="text-sm font-semibold">{post.author.name}</p>
              <p className="text-xs opacity-80">{post.tags.join(', ')}</p>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
 