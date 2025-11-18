const USERS_STORAGE_KEY = 'sciencehub-users';

const withUserId = (userData) => {
  if (typeof userData.id === 'number') {
    return userData;
  }
  return { ...userData, id: Date.now() };
};

const persist = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const userStorage = {
  getAllUsers() {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      const parsed = users ? JSON.parse(users) : [];
      let mutated = false;
      const normalized = parsed.map(entry => {
        const withId = withUserId(entry.userData || {});
        if (withId !== entry.userData) {
          mutated = true;
        }
        return {
          ...entry,
          userData: withId,
        };
      });

      if (mutated) {
        persist(normalized);
      }

      return normalized;
    } catch (error) {
      console.error('Błąd podczas odczytu użytkowników:', error);
      return [];
    }
  },

  registerUser(email, password, userData) {
    try {
      const users = this.getAllUsers();

      if (users.some(u => u.email === email)) {
        return false;
      }

      users.push({ email, password, userData: withUserId(userData) });
      persist(users);
      return true;
    } catch (error) {
      console.error('Błąd podczas rejestracji użytkownika:', error);
      return false;
    }
  },

  loginUserWithDetails(email, password) {
    try {
      const users = this.getAllUsers();
      const userWithEmail = users.find(u => u.email === email);

      if (!userWithEmail) {
        return {
          success: false,
          error: 'Email lub hasło wpisane źle lub nie ma takiego użytkownika.',
        };
      }

      if (userWithEmail.password !== password) {
        return {
          success: false,
          error: 'Hasło jest złe.',
        };
      }

      return {
        success: true,
        user: userWithEmail.userData,
      };
    } catch (error) {
      console.error('Błąd podczas logowania:', error);
      return {
        success: false,
        error: 'Wystąpił błąd podczas logowania.',
      };
    }
  },

  emailExists(email) {
    const users = this.getAllUsers();
    return users.some(u => u.email === email);
  },
};
