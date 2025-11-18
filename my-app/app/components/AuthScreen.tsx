import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Microscope, Mail, Lock, User as UserIcon, Building2, GraduationCap, ArrowLeft } from 'lucide-react';
import { User } from '../../types';
import { userStorage } from '../../lib/userStorage';

const POLISH_UNIVERSITIES = [
  'Uniwersytet Warszawski',
  'Uniwersytet Jagielloński',
  'Politechnika Warszawska',
  'Akademia Górniczo-Hutnicza',
  'Uniwersytet im. Adama Mickiewicza w Poznaniu',
  'Politechnika Wrocławska',
  'Uniwersytet Wrocławski',
  'Politechnika Gdańska',
  'Uniwersytet Gdański',
  'Uniwersytet Mikołaja Kopernika w Toruniu',
  'Politechnika Poznańska',
  'Uniwersytet Śląski w Katowicach',
  'Politechnika Śląska',
  'Uniwersytet Łódzki',
  'Politechnika Łódzka',
  'Katolicki Uniwersytet Lubelski',
  'Uniwersytet Marii Curie-Skłodowskiej w Lublinie',
  'Politechnika Krakowska',
  'Uniwersytet Ekonomiczny w Krakowie',
  'Szkoła Główna Handlowa w Warszawie',
  'Uniwersytet Ekonomiczny w Poznaniu',
  'Politechnika Rzeszowska',
  'Uniwersytet Rzeszowski',
  'Uniwersytet Warmińsko-Mazurski w Olsztynie',
  'Uniwersytet Kazimierza Wielkiego w Bydgoszczy',
  'Politechnika Świętokrzyska',
  'Uniwersytet Przyrodniczy w Poznaniu',
  'Akademia Leona Koźmińskiego',
  'SWPS Uniwersytet Humanistycznospołeczny',
  'Uniwersytet Medyczny w Warszawie',
  'Uniwersytet Medyczny w Łodzi',
  'Uniwersytet Medyczny w Poznaniu',
  'Uniwersytet Medyczny w Gdańsku',
  'Uniwersytet Medyczny we Wrocławiu',
  'Akademia Sztuk Pięknych w Warszawie',
  'Akademia Sztuk Pięknych w Krakowie',
  'Akademia Muzyczna w Krakowie',
  'Instytut Chemii Fizycznej PAN',
  'Instytut Biochemii i Biofizyki PAN',
  'Instytut Fizyki PAN',
  'Centrum Badań Kosmicznych PAN',
  'Instytut Matematyczny PAN',
  'Inna instytucja'
];

const ACADEMIC_TITLES = [
  'Student',
  'Doktorant',
  'Dr',
  'Dr hab.',
  'Prof.',
  'Prof. dr hab.',
  'Mgr',
  'Mgr inż.',
  'Inż.',
  'Asystent',
  'Adiunkt',
  'Badacz',
  'Post-doc'
];

interface AuthScreenProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

export function AuthScreen({ onLogin, onBack }: AuthScreenProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerTitle, setRegisterTitle] = useState('');
  const [registerInstitution, setRegisterInstitution] = useState('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = userStorage.loginUserWithDetails(loginEmail, loginPassword);
    
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setError(result.error || 'Wystąpił błąd podczas logowania.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Check if email already exists
    if (userStorage.emailExists(registerEmail)) {
      setError('Ten email jest już zarejestrowany. Zaloguj się.');
      return;
    }

    // Validate inputs
    if (!registerName || !registerEmail || !registerPassword) {
      setError('Wypełnij wszystkie wymagane pola.');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }
    
    const userData: User = {
      name: registerName,
      avatar: profileImage || '',
      title: registerTitle || 'Badacz',
      bio: 'Nowy członek społeczności naukowej',
      institution: registerInstitution || 'Uniwersytet',
      publications: 0,
      followers: 0,
      following: 0
    };
    
    const registered = userStorage.registerUser(registerEmail, registerPassword, userData);
    
    if (registered) {
      setSuccess('Rejestracja zakończona sukcesem! Możesz się teraz zalogować.');
      // Auto login after registration
      setTimeout(() => {
        onLogin(userData);
      }, 1500);
    } else {
      setError('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
    }
  };

  const handleInstitutionChange = (value: string) => {
    setRegisterInstitution(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md py-8">
        <div className="w-full animate-slide-up">
          {/* Back button */}
          {onBack && (
            <div className="mb-6 flex justify-center animate-fade-in">
              <Button
                variant="ghost"
                onClick={onBack}
                className="gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Powrót do strony głównej
              </Button>
            </div>
          )}

          {/* Logo */}
          <div className="text-center mb-8 animate-scale-in">
            <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-2xl shadow-lg mb-4">
              <Microscope className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-gray-900 text-3xl mb-2">ScienceHub</h1>
            <p className="text-gray-600">Portal dla pasjonatów nauki</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Witaj w społeczności</CardTitle>
              <CardDescription>
                Zaloguj się lub utwórz nowe konto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Logowanie</TabsTrigger>
                  <TabsTrigger value="register">Rejestracja</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="twoj@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Hasło</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full gap-2">
                      Zaloguj się
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Użyj emaila i hasła z rejestracji
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    
                    {success && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {success}
                      </div>
                    )}
                    
                    {/* Profile Image Upload */}
                    <div className="space-y-2">
                      <Label>Zdjęcie profilowe (opcjonalne)</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Profile preview"
                              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                              <UserIcon className="w-10 h-10" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                            id="profile-image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('profile-image-upload')?.click()}
                            className="w-full"
                          >
                            {profileImage ? 'Zmień zdjęcie' : 'Dodaj zdjęcie'}
                          </Button>
                          {profileImage && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setProfileImage('')}
                              className="w-full mt-1 text-red-600"
                            >
                              Usuń zdjęcie
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-name">Imię i nazwisko</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Jan Kowalski"
                          value={registerName}
                          onChange={(e) => setRegisterName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="twoj@email.com"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Hasło</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-title">Tytuł naukowy</Label>
                      <Select value={registerTitle} onValueChange={setRegisterTitle}>
                        <SelectTrigger id="register-title">
                          <SelectValue placeholder="Wybierz tytuł naukowy" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACADEMIC_TITLES.map(title => (
                            <SelectItem key={title} value={title}>
                              {title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-institution">Instytucja</Label>
                      <Select value={registerInstitution} onValueChange={setRegisterInstitution}>
                        <SelectTrigger id="register-institution">
                          <SelectValue placeholder="Wybierz instytucję" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {POLISH_UNIVERSITIES.map(institution => (
                            <SelectItem key={institution} value={institution}>
                              {institution}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full gap-2">
                      Utwórz konto
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Wszystkie dane będą bezpiecznie przechowane lokalnie
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in">
            Dołącz do społeczności naukowców z całego świata
          </p>
        </div>
      </div>
    </div>
  );
}