import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userService } from "../../services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userService
    .userValue;
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await userService.login(email, password);
      if (res.success) {
        setUser(res);
        if (res.role === "Copywriter") {
          router.push("/admin/article");
        } else {
          router.push("/admin/media");
        }
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);