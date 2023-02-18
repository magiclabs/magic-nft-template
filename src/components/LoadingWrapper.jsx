import { UserContext } from "@/lib/UserContext";
import { useContext } from "react";

export default function LoadingWrapper({ children }) {
  const [user] = useContext(UserContext);

  return (
    <>
      {!user?.loading ? (
        <>{children}</>
      ) : (
        <p className="font-bold text-center">
          connecting to wallet, please wait...
        </p>
      )}
    </>
  );
}
