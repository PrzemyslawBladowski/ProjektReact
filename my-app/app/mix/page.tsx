import { fetchPortalData } from "../../lib/api";
import { fallbackPosts } from "../../lib/fallbackData";
import { ClientPostCard } from "./ClientPostCard";

export default async function MixPage() {
  let posts = fallbackPosts.slice(0, 3);
  try {
    const data = await fetchPortalData();
    if (data.posts.length > 0) {
      posts = data.posts.slice(0, 3);
    }
  } catch (error) {
    console.error("Nie udało się pobrać danych dla strony mix.", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-3">
          <p className="text-sm uppercase tracking-widest text-blue-600 font-semibold">ScienceHub Labs</p>
          <h1 className="text-4xl font-bold text-gray-900">Widok łączony Server + Client</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Dane postów są renderowane po stronie serwera, a interaktywna karta reaguje już w przeglądarce.
            Dzięki temu trasa pokazuje, jak łączyć ServerComponent i ClientComponent w Next.js 14.
          </p>
        </header>

        <ClientPostCard posts={posts} />
      </div>
    </div>
  );
}

