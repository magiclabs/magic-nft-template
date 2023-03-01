import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta name="twitter:site" content="@magic_labs" key="twhandle" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_HOST}
          key="ogurl"
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_HOST}/og-card.png`}
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content="Magic NFT Demo"
          key="ogsitename"
        />
        <meta
          property="og:title"
          content="Next.js NFT Template"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Use this template to kickstart your Next.js NFT marketplace or dApp, reducing hours of work to minutes. This Next.js NFT template comes out of the box with code for authentication, fiat onramp, minting NFTs, viewing NFT collections, and web3 token gating."
          key="ogdesc"
        />
        <title>Next.js NFT Template</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
