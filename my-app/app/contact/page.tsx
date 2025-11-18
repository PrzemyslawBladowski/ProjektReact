const biura = [
  {
    miasto: 'Warszawa',
    adres: 'ul. Koszykowa 75, 00-662 Warszawa',
    telefon: '+48 22 123 45 67',
    email: 'warszawa@siencehub.pl',
    godziny: 'Pon-Pt 8:00-18:00',
  },
  {
    miasto: 'Gdańsk',
    adres: 'ul. Narutowicza 11/12, 80-952 Gdańsk',
    telefon: '+48 58 987 65 43',
    email: 'gdansk@siencehub.pl',
    godziny: 'Pon-Pt 8:00-17:00',
  },
  {
    miasto: 'Kraków',
    adres: 'ul. Nawojki 11, 30-072 Kraków',
    telefon: '+48 12 777 66 55',
    email: 'krakow@siencehub.pl',
    godziny: 'Pon-Pt 9:00-17:00',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="bg-white shadow-lg rounded-3xl p-8 border border-blue-100">
          <p className="text-blue-600 font-semibold mb-2">Potrzebujesz pomocy?</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kontakt ScienceHub</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            Nasi koordynatorzy wspierają naukowców, zespoły badawcze i uczelnie w całej Polsce.
            Wybierz dogodny kanał kontaktu lub odwiedź jedno z naszych laboratoriów partnerskich.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {biura.map(biuro => (
            <div
              key={biuro.miasto}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col gap-2"
            >
              <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">
                Biuro {biuro.miasto}
              </p>
              <h2 className="text-2xl font-semibold text-gray-900">{biuro.adres}</h2>
              <p className="text-gray-700">{biuro.godziny}</p>
              <p className="text-gray-500">tel. {biuro.telefon}</p>
              <a
                href={`mailto:${biuro.email}`}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {biuro.email}
              </a>
            </div>
          ))}
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white p-8 shadow-xl">
          <h2 className="text-3xl font-semibold mb-4">Wsparcie techniczne i naukowe</h2>
          <p className="text-blue-50 max-w-3xl mb-6">
            Masz pytania dotyczące integracji z API, migracji danych lub potrzebujesz dedykowanego audytu?
            Zespół ScienceHub Support odpowiada w ciągu 24 godzin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@sciencehub.pl"
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold text-center shadow-md hover:shadow-lg transition-shadow"
            >
              support@sciencehub.pl
            </a>
            <a
              href="tel:+48221234567"
              className="border border-white/40 text-white px-6 py-3 rounded-xl font-semibold text-center hover:bg-white/10 transition-colors"
            >
              +48 22 123 45 67
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}