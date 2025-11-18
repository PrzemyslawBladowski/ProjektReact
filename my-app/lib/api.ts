import { Post, User } from "../types";

const DEFAULT_API_URL = "http://127.0.0.1:8000";

const resolveApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.FASTAPI_API_URL ||
  DEFAULT_API_URL;

interface ApiUser {
  id: number;
  name: string;
  title: string;
  bio: string;
  institution: string;
  avatar?: string | null;
  publications: number;
  followers: number;
  following: number;
}

interface ApiComment {
  id: number;
  author: ApiUser;
  content: string;
  timestamp: string;
}

interface ApiPost {
  id: number;
  author: ApiUser;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  tags: string[];
  images: string[];
  comments: ApiComment[];
}

export interface PortalData {
  users: User[];
  posts: Post[];
}

export interface CreateUserPayload {
  name: string;
  title: string;
  bio: string;
  institution: string;
  avatar?: string;
  publications?: number;
  followers?: number;
  following?: number;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {}

export interface CreatePostPayload {
  authorId: number;
  content: string;
  tags: string[];
  images: string[];
}

export interface UpdatePostPayload {
  content: string;
  tags: string[];
}

export interface LikePayload {
  postId: string;
  action: "like" | "unlike";
}

export interface SharePayload {
  postId: string;
  increment?: boolean;
}

export interface CommentPayload {
  postId: string;
  authorId: number;
  content: string;
}

const mapApiUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name,
  title: user.title,
  bio: user.bio,
  institution: user.institution,
  avatar: user.avatar ?? undefined,
  publications: user.publications,
  followers: user.followers,
  following: user.following,
});

const mapApiPost = (post: ApiPost): Post => ({
  id: post.id.toString(),
  author: mapApiUser(post.author),
  content: post.content,
  timestamp: new Date(post.timestamp),
  likes: post.likes,
  shares: post.shares,
  tags: post.tags,
  images: post.images,
  comments: post.comments.map((comment) => ({
    id: comment.id.toString(),
    author: mapApiUser(comment.author),
    content: comment.content,
    timestamp: new Date(comment.timestamp),
  })),
});

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Błąd komunikacji z API");
  }
  return response.json() as Promise<T>;
};

export const fetchPortalData = async (): Promise<PortalData> => {
  const apiUrl = resolveApiUrl();

  const [users, posts] = await Promise.all([
    handleResponse<ApiUser[]>(await fetch(`${apiUrl}/users`, { cache: "no-store" })),
    handleResponse<ApiPost[]>(await fetch(`${apiUrl}/posts`, { cache: "no-store" })),
  ]);

  return {
    users: users.map(mapApiUser),
    posts: posts.map(mapApiPost),
  };
};

export const createRemoteUser = async (payload: CreateUserPayload): Promise<User> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<ApiUser>(response);
  return mapApiUser(data);
};

export const updateRemoteUser = async (
  userId: number,
  payload: UpdateUserPayload,
): Promise<User> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<ApiUser>(response);
  return mapApiUser(data);
};

export const createRemotePost = async (payload: CreatePostPayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author_id: payload.authorId,
      content: payload.content,
      tags: payload.tags,
      images: payload.images,
    }),
  });
  const data = await handleResponse<ApiPost>(response);
  return mapApiPost(data);
};

export const updateRemotePost = async (
  postId: string,
  payload: UpdatePostPayload,
): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/posts/${Number(postId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<ApiPost>(response);
  return mapApiPost(data);
};

export const deleteRemotePost = async (postId: string): Promise<void> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/posts/${Number(postId)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Nie udało się usunąć posta");
  }
};

export const toggleRemoteLike = async ({ postId, action }: LikePayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/posts/${Number(postId)}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direction: action }),
  });
  const data = await handleResponse<ApiPost>(response);
  return mapApiPost(data);
};

export const registerRemoteShare = async ({ postId, increment = true }: SharePayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/posts/${Number(postId)}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ increment }),
  });
  const data = await handleResponse<ApiPost>(response);
  return mapApiPost(data);
};

export const addRemoteComment = async (payload: CommentPayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  const response = await fetch(`${apiUrl}/posts/${Number(payload.postId)}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author_id: payload.authorId,
      content: payload.content,
    }),
  });
  const data = await handleResponse<ApiPost>(response);
  return mapApiPost(data);
};

