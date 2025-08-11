import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("Authorization");

  if (!token) {
    console.log("token null");
    return <Navigate to="/" replace />;
  }

  return children;
}
