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
              getUserData().then((data) => setUser(data));
            })
            .catch((err) => console.error(err));
        }}
        className="btn inline-flex space-x-3 text-lg"
      >
        <span>Sign up</span>
      </button>
    </div>
  );
}
