import { Post, User } from "../types";

export const fallbackUsers: User[] = [
  {
    id: 1,
    name: "Dr Anna Kowalska",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    title: "Profesor Fizyki Kwantowej",
    bio: "Specjalistka od splątania kwantowego i edukatorka naukowa.",
    institution: "Uniwersytet Warszawski",
    publications: 47,
    followers: 1250,
    following: 320,
  },
  {
    id: 2,
    name: "Prof. Jan Nowak",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    title: "Kierownik Katedry Biotechnologii",
    bio: "Badacz w dziedzinie biotechnologii i inżynierii genetycznej.",
    institution: "Politechnika Gdańska",
    publications: 89,
    followers: 2100,
    following: 450,
  },
  {
    id: 3,
    name: "Dr Katarzyna Wiśniewska",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    title: "Badaczka AI i Machine Learning",
    bio: "Tworzy modele AI do przewidywania zmian klimatu.",
    institution: "AGH Kraków",
    publications: 34,
    followers: 980,
    following: 210,
  },
];

export const fallbackPosts: Post[] = [
  {
    id: "1",
    author: fallbackUsers[0],
    content:
      "Najnowsze odkrycia w dziedzinie splątania kwantowego pokazują, że możemy osiągnąć kwantową supremację w praktycznych zastosowaniach obliczeniowych. Nasze badania wskazują na 40% poprawę efektywności w porównaniu do dotychczasowych metod.",
    timestamp: new Date("2024-11-15T10:30:00"),
    likes: 127,
    shares: 23,
    tags: ["Fizyka Kwantowa", "Badania", "Technologia"],
    images: [
      "https://images.unsplash.com/photo-1755455840466-85747052a634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwcGh5c2ljcyUyMHZpc3VhbGl6YXRpb258ZW58MXx8fHwxNzYzMzcwMzE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    comments: [],
  },
  {
    id: "2",
    author: fallbackUsers[1],
    content:
      "Przełomowe wyniki w terapii genowej CRISPR-Cas9. Nasza drużyna badawcza z powodzeniem zastosowała edycję genów do leczenia rzadkich chorób genetycznych. Publikacja w Nature już dostępna! 🧬",
    timestamp: new Date("2024-11-14T14:20:00"),
    likes: 243,
    shares: 56,
    tags: ["Biotechnologia", "CRISPR", "Medycyna"],
    images: [
      "https://images.unsplash.com/photo-1676206584909-c373cf61cefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkbmElMjBoZWxpeCUyMG1vbGVjdWxhcnxlbnwxfHx8fDE3NjMzNzAzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    comments: [],
  },
  {
    id: "3",
    author: fallbackUsers[2],
    content:
      "Nasz nowy model sztucznej inteligencji do przewidywania zmian klimatycznych osiągnął dokładność 94%. Wykorzystaliśmy dane z ostatnich 50 lat i najnowsze algorytmy deep learning.",
    timestamp: new Date("2024-11-16T09:15:00"),
    likes: 189,
    shares: 34,
    tags: ["AI", "Klimat", "Machine Learning"],
    comments: [],
  },
  {
    id: "4",
    author: fallbackUsers[0],
    content:
      "Nowe badania nad komputerami kwantowymi w laboratorium. Testujemy różne konfiguracje qubitów.",
    timestamp: new Date("2024-11-17T08:00:00"),
    likes: 56,
    shares: 12,
    tags: ["Fizyka Kwantowa", "Laboratorium"],
    images: [
      "https://images.unsplash.com/photo-1614308457932-e16d85c5d053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwbWljcm9zY29wZSUyMHNjaWVuY2V8ZW58MXx8fHwxNzYzMzcwMzE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    comments: [],
  },
];

