// utils/useCurrentUser.ts
import { useEffect, useState } from "react";
import getCurrentUser from "../utils/currentUser";

export const useCurrentUser = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
  }, []);
  return user;
};
