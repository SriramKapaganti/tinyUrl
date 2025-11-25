import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setloading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/check`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        console.log(response.ok);
        setAuth(response.ok);
      } catch {
        setAuth(false);
      } finally {
        setloading(false);
      }
    })();
  }, []);
  if (loading) {
    return <p>Loading ......</p>;
  }
  return auth ? children : <Navigate to="/login" />;
}
