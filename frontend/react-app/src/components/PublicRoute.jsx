import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("authToken");

  // se estiver logado, manda direto pra dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // se não estiver logado, permite acessar a rota normalmente
  return <Outlet />;
}