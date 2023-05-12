import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useMagicContext } from "@/context/MagicContext";
import Image from "next/image";

import styles from "@/styles/Modal.module.css";
import CollectibleCard from "./CollectibleCard";
import Link from "next/link";

export default function Modal() {
  const { user, setUser } = useUser();
  const { contract } = useMagicContext();
  const [showModal, setShowModal] = useState(false);
  const [tokenURI, setTokenURI] = useState("");

  useEffect(() => {
    // // do nothing if the user is not logged in
    if (!user?.address || !user?.tokenIdForModal) return;

    if (user?.tokenIdForModal) {
      setUser({ ...user, tokenIdForModal: false });

      (async () => {
        try {
          const uri = await contract.methods
            .tokenURI(user?.tokenIdForModal)
            .call();
          console.log(`Token ID ${uri.value} has URI of ${uri}`);

          setTokenURI(uri);
          setShowModal(true);
          console.log("show the minted modal");
        } catch (err) {
          console.warn(err);
        }
      })();
    }
  }, [user?.address, user?.tokenIdForModal]);

  if (!showModal) return null;

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
                <Image src="/img/close.svg" width={16} height={16} alt="X" />
              </button>
            </div>

            <div className={styles.content}>
              <p className="text-center text-lg">You have minted a new NFT!</p>
              {tokenURI && (
                <div className="mx-auto w-64">
                  <CollectibleCard tokenURI={tokenURI} />
                </div>
              )}
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
                onClick={() => setShowModal(false)}
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
