import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const token = ref(null);

  // Set user + token després de login
  const setUser = (usr, tkn) => {
    user.value = usr;
    token.value = tkn;
    localStorage.setItem("user", JSON.stringify({ user: usr, token: tkn }));
  };

  // Carregar user des de localStorage
  const loadUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      user.value = parsed.user;
      token.value = parsed.token;
    }
  };

  // Logout
  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("user");
  };

  return { user, token, setUser, loadUser, logout };
});