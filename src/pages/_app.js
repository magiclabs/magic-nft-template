import "@/styles/globals.css";
import { useState, useEffect } from "react";
import { UserContext } from "@/lib/UserContext";
import { getUserData } from "@/lib/utils";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState();

  // auto load the user's authenticated state via magic
  useEffect(() => {
    setUser({ loading: true });

    // auto load the userData and store it in the state
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
