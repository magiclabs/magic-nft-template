import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { UserContext } from "@/lib/UserContext";
import { getUserData } from "@/lib/magic";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState();

  // auto load the user's antenticated state via magic
  useEffect(() => {
    setUser({ loading: true });

    // create an execute the async function
    (async () => {
      await getUserData().then((data) => setUser(data));
    })();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}
