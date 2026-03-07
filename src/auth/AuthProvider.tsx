import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("authToken", tokenFromUrl);
      setToken(tokenFromUrl);

      // clean URL
      window.history.replaceState({}, "", "/");
    } else {
      setToken(localStorage.getItem("authToken"));
    }

    setReady(true);
  }, []);

  if (!ready) {
    return <div>Loading...</div>;
  }
    return (
    <AuthContext.Provider value={{ token }}>
      {children}
    </AuthContext.Provider>
  );
}
