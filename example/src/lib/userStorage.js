const USERS_STORAGE_KEY = 'sciencehub-users';

export const userStorage = {
  // Get all registered users
  getAllUsers() {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading users from storage:', error);
      return [];
    }
  },

  // Register a new user
  registerUser(email, password, userData) {
    try {
      const users = this.getAllUsers();
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return false;
      }

      users.push({ email, password, userData });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  },

  // Login user
  loginUser(email, password) {
    try {
      const users = this.getAllUsers();
      const user = users.find(u => u.email === email && u.password === password);
      return user ? user.userData : null;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  },

  // Login user with detailed error information
  loginUserWithDetails(email, password) {
    try {
      const users = this.getAllUsers();
      const userWithEmail = users.find(u => u.email === email);
      
      if (!userWithEmail) {
        return { 
          success: false, 
          error: 'Email lub hasło wpisane źle lub nie ma takiego użytkownika.' 
        };
      }
      
      if (userWithEmail.password !== password) {
        return { 
          success: false, 
          error: 'Hasło jest złe.' 
        };
      }
      
      return { 
        success: true, 
        user: userWithEmail.userData 
      };
    } catch (error) {
      console.error('Error logging in:', error);
      return { 
        success: false, 
        error: 'Wystąpił błąd podczas logowania.' 
      };
    }
  },

  // Update user data
  updateUser(email, updates) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) return false;

      users[userIndex].userData = {
        ...users[userIndex].userData,
        ...updates
      };

      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  // Check if email exists
  emailExists(email) {
    const users = this.getAllUsers();
    return users.some(u => u.email === email);
  }
};
