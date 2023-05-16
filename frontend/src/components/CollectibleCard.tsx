import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchJSONfromURI, ipfsToHttps } from "@/lib/utils";

interface CollectibleCardProps {
  item?: { id: number; image: string };
  tokenURI?: string;
}

interface Metadata {
  name?: string;
  image?: string;
  tokenId?: string;
}

export default function CollectibleCard({
  item,
  tokenURI,
}: CollectibleCardProps) {
  let [metadata, setMetadata] = useState<Metadata>({});

  // Fetch the token's metadata from the given `tokenURI` url
  const fetchMetadata = async (uri: string) => {
    const data = await fetchJSONfromURI(uri);
    data.image = ipfsToHttps(data?.image);
    setMetadata(data);
  };

  // Auto fetch the token's metadata
  useEffect(() => {
    // If item is defined and has an image property, set it as metadata
    if (item?.image) {
      setMetadata(item);
    }
    // If tokenURI is defined, fetch the metadata from the tokenURI
    else if (tokenURI) {
      fetchMetadata(tokenURI);
    }
  }, [item, tokenURI]);

  // Do not attempt to show the collectible card if a metadata image is not provided
  if (!metadata?.image) return null;

  return (
    <div className="mx-auto overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-brand">
      {metadata?.name && (
        <div className="w-full bg-white bg-opacity-80 px-4 py-2 font-semibold">
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
