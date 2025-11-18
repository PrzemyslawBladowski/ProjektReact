import { fetchPortalData } from "../lib/api";
import { fallbackPosts } from "../lib/fallbackData";
import { HomeClient } from "./home/HomeClient";

export default async function HomePage() {
  try {
    const data = await fetchPortalData();
    return <HomeClient initialPosts={data.posts} />;
  } catch (error) {
    // Silently fall back to fallback data - error is expected when API is not running
    // Only log in development mode to reduce console noise
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "API niedostępne, używam danych zapasowych. Aby połączyć się z API, uruchom serwer FastAPI:",
        error instanceof Error ? error.message : String(error)
      );
    }
    return <HomeClient initialPosts={fallbackPosts} />;
  }
}
