import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Twitter */}
        {/* <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content={twitterHandle} key="twhandle" /> */}

        {/* Open Graph */}
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_HOST}
          key="ogurl"
        />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_HOST}/OG Card - Next.js NFT Template.png`}
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
          content="Clone this template from Magic to get auth, wallet, onramp, minting, viewing, and token gating out of the box."
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
