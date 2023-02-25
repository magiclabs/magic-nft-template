import { useEffect, useState } from "react";
import { fetchJSONfromURI, ipfsToHttps } from "@/lib/utils";
import Image from "next/image";

export default function CollectibleCard({ item, tokenURI }) {
  let [metadata, setMetadata] = useState({});

  // auto fetch the token's metadata from the given `tokenURI` url
  useEffect(() => {
    // when provided, set the `item` as the `metadata`
    if (item?.image) return setMetadata(item);
    else if (!tokenURI) return;

    (async () => {
      await fetchJSONfromURI(tokenURI).then((data) => {
        data.image = ipfsToHttps(data?.image);
        // console.log("metadata:", data);
        setMetadata(data);
      });
    })();
  }, [item, tokenURI]);

  // do not attempt to show the collectible card if a metadata image is not provided
  if (!metadata?.image) return <></>;

  return (
    <div className="w-64 h-64 mx-auto overflow-hidden border border-gray-200 bg-gray-50 rounded-xl shadow-brand">
      {metadata?.name && (
        <div className="w-full px-4 py-2 font-semibold bg-white bg-opacity-80">
          {metadata.name}
        </div>
      )}

      <Image
        src={metadata.image}
        width={256}
        height={256}
        alt="Hiro Collectible NFT"
      />
    </div>
  );
}
