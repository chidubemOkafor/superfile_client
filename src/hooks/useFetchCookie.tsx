import { useEffect, useState } from "react";

const useFetchCookie = () => {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const fetchCookie = async () => {
      try {
        const access_token = await cookieStore.get("access_token");
        console.log("access_token from cookieStore: ", access_token);
        if (!access_token) {
          console.log("No access token found in cookies");
          setJwt(null);
          return;
        }
        setJwt(access_token.value ?? null);
        console.log("jwt from cookie: ", access_token.value);
      } catch (e) {
        console.error("Error fetching cookie:", e);
        setJwt(null);
      }
    };
    fetchCookie();
  }, []);

  return jwt;
};

export default useFetchCookie;