import { fetchPortalData } from "../lib/api";
import { fallbackPosts } from "../lib/fallbackData";
import { HomeClient } from "./home/HomeClient";

export default async function HomePage() {
  try {
    const data = await fetchPortalData();
    return <HomeClient initialPosts={data.posts} />;
  } catch (error) {
    console.error("Błąd pobierania danych z FastAPI. Używam danych zapasowych.", error);
    return <HomeClient initialPosts={fallbackPosts} />;
  }
}
