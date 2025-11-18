import { fetchPortalData } from "../../../lib/api";
import { fallbackPosts } from "../../../lib/fallbackData";

async function getLatestPosts() {
  try {
    const data = await fetchPortalData();
    return data.posts.slice(0, 2);
  } catch (error) {
    console.error("Brak połączenia z API. Używam danych zapasowych.", error);
    return fallbackPosts.slice(0, 2);
  }
}

export default async function GdanskContactPage() {
  const recentPosts = await getLatestPosts();

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <p className="text-sm uppercase text-blue-600 tracking-widest">ScienceHub</p>
          <h1 className="text-4xl font-bold text-gray-900">Centrum Gdańsk – laboratorium terenowe</h1>
          <p className="text-gray-600">
            Spotkaj się z zespołem badawczym na Politechnice Gdańskiej i dołącz do projektów dotyczących biotechnologii oraz energetyki.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-100 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dane kontaktowe</h2>
            <p className="text-gray-700">ul. Narutowicza 11/12</p>
            <p className="text-gray-700">80-233 Gdańsk</p>
            <p className="text-gray-500 mt-2">Telefon: +48 58 987 65 43</p>
            <a className="text-blue-600 font-semibold block mt-2" href="mailto:gdansk@siencehub.pl">
              gdansk@siencehub.pl
            </a>
            <p className="text-gray-500 mt-2">Godziny pracy: Pon-Pt 8:00-17:00</p>
          </div>

          <div className="rounded-2xl border border-blue-100 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Specjalizacje ośrodka</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Laboratoria biologii syntetycznej i inżynierii białek</li>
              <li>Projekty morskiej energetyki odnawialnej</li>
              <li>Szkoła letnia AI dla naukowców w Trójmieście</li>
            </ul>
          </div>
        </section>

        <section className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Najnowsze publikacje zespołów z Gdańska</h2>
          <div className="space-y-6">
            {recentPosts.map(post => (
              <article key={post.id} className="bg-white rounded-2xl p-6 shadow">
                <p className="text-sm text-blue-600 mb-2">{post.author.name}</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{post.tags.join(' • ')}</h3>
                <p className="text-gray-700 leading-relaxed">{post.content}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {post.likes} polubień • {post.shares} udostępnień
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}