import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const eqms_key = localStorage.getItem("eqms-key");
  if (!eqms_key) {
    console.log("eqms_key null");
    return <Navigate to="/Landing" replace />;
  }

  return children;
}
