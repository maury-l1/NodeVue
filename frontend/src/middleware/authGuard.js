import { useUserStore } from "@/stores/useUser"; 

export function authGuard(to, from, next) {
  const userStore = useUserStore();
  userStore.loadUser();

  if (userStore.user) {
    next();
  } else {
    // Redirige a página de error 
    next({ path: "/error" });
  }
}
