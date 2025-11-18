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

interface FastAPIValidationError {
  type: string;
  loc: (string | number)[];
  msg: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

interface FastAPIErrorDetail {
  detail: string | FastAPIValidationError[];
}

const parseValidationError = (error: FastAPIValidationError): string => {
  const field = error.loc[error.loc.length - 1] as string;
  const fieldName = field === "content" ? "treść" : 
                   field === "author_id" ? "autor" :
                   field === "tags" ? "tagi" :
                   field === "name" ? "imię i nazwisko" :
                   field === "title" ? "tytuł" :
                   field === "bio" ? "biografia" :
                   field === "institution" ? "instytucja" :
                   field;

  if (error.type === "string_too_short") {
    const minLength = error.ctx?.min_length as number | undefined;
    return minLength 
      ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} musi mieć co najmniej ${minLength} znaków.`
      : `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} jest za krótkie.`;
  }
  
  if (error.type === "string_too_long") {
    const maxLength = error.ctx?.max_length as number | undefined;
    return maxLength
      ? `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} może mieć maksymalnie ${maxLength} znaków.`
      : `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} jest za długie.`;
  }

  if (error.type === "value_error") {
    return `Nieprawidłowa wartość dla pola ${fieldName}.`;
  }

  if (error.type === "missing") {
    return `Pole ${fieldName} jest wymagane.`;
  }

  return error.msg || `Błąd walidacji pola ${fieldName}.`;
};

const parseFastAPIError = (errorDetail: FastAPIErrorDetail): string => {
  if (typeof errorDetail.detail === "string") {
    return errorDetail.detail;
  }

  if (Array.isArray(errorDetail.detail)) {
    const messages = errorDetail.detail.map(parseValidationError);
    return messages.join(" ");
  }

  return "Błąd walidacji danych.";
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  // Zawsze najpierw pobieramy tekst, bo response można odczytać tylko raz
  const text = await response.text();
  
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = "Błąd komunikacji z API";

    try {
      if (contentType?.includes("application/json") || text.trim().startsWith("{")) {
        try {
          const errorData: FastAPIErrorDetail = JSON.parse(text);
          errorMessage = parseFastAPIError(errorData);
        } catch {
          errorMessage = text || errorMessage;
        }
      } else {
        errorMessage = text || errorMessage;
      }
    } catch {
      // Jeśli nie udało się sparsować, użyj domyślnego komunikatu
    }

    throw new Error(errorMessage);
  }
  
  // Dla sukcesu parsujemy JSON
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Nieprawidłowa odpowiedź z serwera (oczekiwano JSON)");
  }
};

const isNetworkError = (error: unknown): boolean => {
  const errorMsg = error instanceof Error ? error.message : String(error);
  const lowerErrorMsg = errorMsg.toLowerCase();
  
  // Check for various network/connection error patterns (case-insensitive)
  return (
    lowerErrorMsg.includes("fetch failed") ||
    lowerErrorMsg.includes("failed to fetch") ||
    lowerErrorMsg.includes("econnrefused") ||
    lowerErrorMsg.includes("network") ||
    lowerErrorMsg.includes("connection") ||
    lowerErrorMsg.includes("refused") ||
    lowerErrorMsg.includes("econnreset") ||
    lowerErrorMsg.includes("timeout")
  );
};

const handleFetchError = (error: unknown, operation: string, apiUrl: string): never => {
  const errorMsg = error instanceof Error ? error.message : String(error);
  
  if (isNetworkError(error)) {
    throw new Error(`API niedostępne: nie można ${operation}. Upewnij się, że serwer FastAPI jest uruchomiony na ${apiUrl}.`);
  }
  throw new Error(`Nie udało się ${operation}: ${errorMsg}`);
};

export const fetchPortalData = async (): Promise<PortalData> => {
  const apiUrl = resolveApiUrl();

  try {
    const [users, posts] = await Promise.all([
      fetch(`${apiUrl}/users`, { cache: "no-store" })
        .then((res) => handleResponse<ApiUser[]>(res))
        .catch((error) => {
          if (isNetworkError(error)) {
            throw new Error(`API niedostępne: ${apiUrl}. Upewnij się, że serwer FastAPI jest uruchomiony.`);
          }
          const errorMsg = error instanceof Error ? error.message : String(error);
          throw new Error(`Nie udało się pobrać użytkowników: ${errorMsg}`);
        }),
      fetch(`${apiUrl}/posts`, { cache: "no-store" })
        .then((res) => handleResponse<ApiPost[]>(res))
        .catch((error) => {
          if (isNetworkError(error)) {
            throw new Error(`API niedostępne: ${apiUrl}. Upewnij się, że serwer FastAPI jest uruchomiony.`);
          }
          const errorMsg = error instanceof Error ? error.message : String(error);
          throw new Error(`Nie udało się pobrać postów: ${errorMsg}`);
        }),
    ]);

    return {
      users: users.map(mapApiUser),
      posts: posts.map(mapApiPost),
    };
  } catch (error) {
    // Re-throw with a cleaner message for the page component to handle
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Błąd połączenia z API (${apiUrl})`);
  }
};

export const createRemoteUser = async (payload: CreateUserPayload): Promise<User> => {
  const apiUrl = resolveApiUrl();
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<ApiUser>(response);
    return mapApiUser(data);
  } catch (error) {
    handleFetchError(error, "utworzyć użytkownika", apiUrl);
  }
};

export const updateRemoteUser = async (
  userId: number,
  payload: UpdateUserPayload,
): Promise<User> => {
  const apiUrl = resolveApiUrl();
  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<ApiUser>(response);
    return mapApiUser(data);
  } catch (error) {
    handleFetchError(error, "zaktualizować użytkownika", apiUrl);
  }
};

export const createRemotePost = async (payload: CreatePostPayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  try {
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
  } catch (error) {
    handleFetchError(error, "utworzyć post", apiUrl);
  }
};

export const updateRemotePost = async (
  postId: string,
  payload: UpdatePostPayload,
): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  try {
    const response = await fetch(`${apiUrl}/posts/${Number(postId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<ApiPost>(response);
    return mapApiPost(data);
  } catch (error) {
    handleFetchError(error, "zaktualizować post", apiUrl);
  }
};

export const deleteRemotePost = async (postId: string): Promise<void> => {
  const apiUrl = resolveApiUrl();
  try {
    const response = await fetch(`${apiUrl}/posts/${Number(postId)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Nie udało się usunąć posta");
    }
  } catch (error) {
    handleFetchError(error, "usunąć post", apiUrl);
  }
};

export const toggleRemoteLike = async ({ postId, action }: LikePayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  try {
    const response = await fetch(`${apiUrl}/posts/${Number(postId)}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direction: action }),
    });
    const data = await handleResponse<ApiPost>(response);
    return mapApiPost(data);
  } catch (error) {
    handleFetchError(error, "zmienić stan polubienia", apiUrl);
  }
};

export const registerRemoteShare = async ({ postId, increment = true }: SharePayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  try {
    const response = await fetch(`${apiUrl}/posts/${Number(postId)}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ increment }),
    });
    const data = await handleResponse<ApiPost>(response);
    return mapApiPost(data);
  } catch (error) {
    handleFetchError(error, "zarejestrować udostępnienie", apiUrl);
  }
};

export const addRemoteComment = async (payload: CommentPayload): Promise<Post> => {
  const apiUrl = resolveApiUrl();
  try {
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
  } catch (error) {
    handleFetchError(error, "dodać komentarz", apiUrl);
  }
};

