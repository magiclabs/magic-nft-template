import { UserContext } from "@/lib/UserContext";
import Image from "next/image";
import { useContext } from "react";

export default function LoadingWrapper({
  children,
  loading = false,
  message = "loading, please wait...",
}) {
  const [user] = useContext(UserContext);

  return (
    <>
      {!loading && !user?.loading ? (
        <>{children}</>
      ) : (
        <div className="text-xl text-center">
          <Image
            src={"/img/spinner.svg"}
            width={64}
            height={64}
            alt="loading spinner"
            className="block mx-auto"
          />

          <p>{message}</p>
        </div>
      )}
    </>
  );
}
