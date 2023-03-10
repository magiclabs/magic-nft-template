import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/UserContext";
import { requestMintNFT } from "@/lib/utils";
import { contract, web3 } from "@/lib/web3";

import styles from "@/styles/Modal.module.css";
import CollectibleCard from "./CollectibleCard";
import Link from "next/link";

export default function Modal() {
  const [user, setUser] = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [tokenURI, setTokenURI] = useState("");

  useEffect(() => {
    // // do nothing if the user is not logged in
    if (!user?.address || !user?.tokenIdForModal) return;

    // //
    // if (user?.address && !user?.refreshCollectibles && user?.collectibles) {
    //   // setLoading(false);
    //   return;
    // }

    if (user?.tokenIdForModal) {
      setUser({ ...user, tokenIdForModal: false });

      (async () => {
        // console.log("Fetch the newly minted NFT...");
        await contract.methods
          .tokenURI(user?.tokenIdForModal)
          // .tokenURI(1)
          .call()
          .then((uri) => {
            console.log(`Token ID ${uri.value} has URI of ${uri}`);

            setTokenURI(uri);
            setShowModal(true);
            console.log("show the minted modal");

            return uri;
          })
          .catch((err) => console.warn(err));
      })();

      // remove the tracking of the tokenId for modal use
      // setUser({ ...user, tokenIdForModal: false });
    }
  }, [
    user?.address,
    user?.refreshCollectibles,
    user?.collectibles,
    user?.tokenIdForModal,
  ]);

  if (!showModal) return <></>;

  return (
    <>
      <div className={styles.modal}>
        <div className={styles.modalInner}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <h3>Congratulations 🥳</h3>

              <button
                onClick={() => setShowModal(false)}
                className="hidden sm:block"
              >
                <img src="/img/close.svg" width={16} height={16} alt="X" />
              </button>
            </div>

            <div className={styles.content}>
              <p className="text-center text-lg">You have minted a new NFT!</p>

              {tokenURI && <CollectibleCard tokenURI={tokenURI} />}
            </div>

            <div
              className={`${styles.footer} flex flex-col md:flex-row ${styles.footerReverse}`}
            >
              <button
                className="btn btn-light mx-auto w-full"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

              <Link
                href="/collectibles"
                className="btn mx-auto w-full text-center"
              >
                View all collectibles
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.background}></div>
    </>
  );
}
