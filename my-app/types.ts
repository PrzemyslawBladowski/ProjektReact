// Definicje typów dla aplikacji ScienceHub

export interface User {
  id: number;
  name: string;
  avatar?: string;
  title: string;
  bio: string;
  institution: string;
  publications: number;
  followers: number;
  following: number;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
  likes: number;
  comments: Comment[];
  shares: number;
  tags: string[];
  images?: string[];
}

