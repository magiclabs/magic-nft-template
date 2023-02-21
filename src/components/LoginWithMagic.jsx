import { useContext } from "react";
import { UserContext } from "@/lib/UserContext";
import { magic } from "@/lib/magic";
import { getUserData } from "@/lib/utils";

export default function LoginWithMagic({ className = "" }) {
  const [user, setUser] = useContext(UserContext);

  return (
    <div className={className}>
      <button
        onClick={() => {
          magic.wallet
            .connectWithUI()
            .then((res) => {
              (async () => {
                await getUserData().then((data) => setUser(data));
              })();
            })
            .catch((err) => console.error(err));
        }}
        className="inline-flex space-x-3 text-xl btn-outline"
      >
        <span>Sign Up</span>
        {/* <img src="/logo.svg" className="h-8" /> */}
      </button>
    </div>
  );
}
