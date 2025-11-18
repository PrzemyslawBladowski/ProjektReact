// Lista wulgaryzmów w języku polskim i angielskim
const PROFANITY_LIST = [
  // Polski
  'kurwa', 'kurde', 'kurde', 'kurczę', 'kurna', 'kurka',
  'chuj', 'chuja', 'chujek', 'chujowy', 'chujowa', 'chujowe',
  'pierdol', 'pierdolić', 'pierdolenie', 'pierdolnięty', 'pierdolony',
  'jebać', 'jebany', 'jebana', 'jebane', 'jebaniec', 'jebak',
  'spierdal', 'spierdalaj', 'spierdolić',
  'gówno', 'gówna', 'gówniarz', 'gówniany',
  'dupa', 'dupek', 'dupcia', 'dupsko',
  'skurwysyn', 'skurwiel', 'skurwysyn',
  'dziwka', 'dziwki', 'kurewka', 'kurewki',
  'pojeb', 'pojebany', 'pojebana', 'pojebane',
  'zasraniec', 'zasrany', 'zasrana',
  'cipa', 'cipka', 'cipsko',
  'pizda', 'pizdą',
  'śmieć', 'gnój', 'gnida',
  'debil', 'debilizm', 'debilny',
  'idiota', 'idiotyzm', 'idiotyczny',
  'kretyn', 'kretynizm', 'kretyński',
  'zjeb', 'zjebany', 'zjebana', 'zjebane',
  'wkurw', 'wkurwiony', 'wkurwiona',
  'zajeb', 'zajebisty', 'zajebista', 'zajebiste',
  'nawał', 'nawal', 'nawalony', 'nawalona',
  'pierdnąć', 'pierdnięcie', 'pierdziel',
  'dziad', 'dziadostwo',
  'cwel', 'cwele', 'cwelek',
  'kuttas', 'kutas', 'kutasie',
  'fiut', 'fiuta', 'fiutek',
  'huj', 'huja',
  
  // Angielski
  'fuck', 'fucking', 'fucked', 'fucker', 'fuckhead', 'motherfucker',
  'shit', 'shitty', 'shitting', 'bullshit', 'shithead',
  'ass', 'asshole', 'arse', 'arsehole', 'badass', 'dumbass',
  'bitch', 'bitching', 'bitchy', 'bitches',
  'bastard', 'bastards',
  'damn', 'damned', 'dammit', 'goddamn',
  'hell', 'helluva',
  'crap', 'crappy', 'crapping',
  'dick', 'dickhead', 'dicks',
  'cock', 'cocksucker',
  'pussy', 'pussies',
  'cunt', 'cunts',
  'piss', 'pissed', 'pissing',
  'whore', 'whores', 'slut', 'sluts',
  'douche', 'douchebag',
  'retard', 'retarded', 'retards',
  'moron', 'moronic', 'imbecile',
  'idiot', 'idiotic', 'idiots',
  'stupid', 'dumb',
  'jerk', 'jerks',
  'screw', 'screwed', 'screwing',
  'suck', 'sucks', 'sucking',
  'twat', 'twats',
  'wanker', 'wank',
  'bollocks', 'bloody',
  'prick', 'pricks'
];

/**
 * Funkcja cenzurująca wulgaryzmy w tekście
 * @param {string} text - Tekst do ocenzurowania
 * @returns {string} Ocenzurowany tekst
 */
export function censorProfanity(text) {
  if (!text) return text;
  
  let censoredText = text;
  
  // Sortuj według długości (od najdłuższych) aby uniknąć częściowych zamian
  const sortedProfanity = [...PROFANITY_LIST].sort((a, b) => b.length - a.length);
  
  sortedProfanity.forEach(word => {
    // Użyj regex z flagą 'gi' (global, case-insensitive)
    // \\b oznacza granicę słowa, aby nie cenzurować części innych słów
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    
    censoredText = censoredText.replace(regex, (match) => {
      // Zachowaj pierwszą literę i zastąp resztę gwiazdkami
      if (match.length <= 1) return '*';
      return match[0] + '*'.repeat(match.length - 1);
    });
  });
  
  return censoredText;
}

/**
 * Sprawdza czy tekst zawiera wulgaryzmy
 * @param {string} text - Tekst do sprawdzenia
 * @returns {boolean} true jeśli tekst zawiera wulgaryzmy
 */
export function containsProfanity(text) {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Zlicza liczbę wulgaryzmów w tekście
 * @param {string} text - Tekst do sprawdzenia
 * @returns {number} Liczba znalezionych wulgaryzmów
 */
export function countProfanity(text) {
  if (!text) return 0;
  
  const lowerText = text.toLowerCase();
  let count = 0;
  
  PROFANITY_LIST.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      count += matches.length;
    }
  });
  
  return count;
}
