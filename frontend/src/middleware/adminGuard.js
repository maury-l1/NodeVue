import { useUserStore } from "@/stores/useUser"; 

export function adminGuard(to, from, next) {
  const userStore = useUserStore();
  userStore.loadUser();

  if (userStore.user && userStore.user.rol === "admin") {
    next();
  } else {
    // Redirige a página de error si no es admin
    next({ path: "/error" });
  }
}