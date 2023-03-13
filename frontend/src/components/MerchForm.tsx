import { useContext, useEffect } from "react";
import { UserContext } from "@/lib/UserContext";

export default function MerchForm() {
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/v2.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      // @ts-ignore
      if (window.hbspt) {
        // @ts-ignore
        window.hbspt.forms.create({
          portalId: "20846682",
          formId: "5f4c070b-7ff0-4ead-8161-b9b54bcb9778",
          target: "#hubspotForm",
        });
      }
    });
  }, [user?.address, user?.refreshCollectibles, user?.collectibles]);

  return (
    <div className="min-w-[400px]">
      <div className="mx-auto max-w-xl" id="hubspotForm"></div>
    </div>
  );
}
