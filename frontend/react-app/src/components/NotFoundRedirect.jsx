import { Navigate } from "react-router-dom";

export default function NotFoundRedirect() {
  const token = localStorage.getItem("authToken");

  if (token) {
    // usuário logado: manda pra área logada
    return <Navigate to="/dashboard" replace />;
  }

  // usuário não logado: manda pra home pública
  return <Navigate to="/" replace />;
}