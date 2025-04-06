import { checkAuthStatus } from "@/app/actions/auth";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedin] = useState(false);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const status = await checkAuthStatus();
      setIsLoggedin(status);
    };

    fetchAuthStatus();
  }, []);

  return isLoggedIn;
}
