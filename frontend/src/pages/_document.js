import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          property="og:title"
          content="Next.js NFT Template"
          key="ogtitle"
        />
        <meta property="og:description" content="" key="ogdesc" />
        <meta
          property="og:image"
          content="/OG Card - Next.js NFT Template.png"
          key="ogimage"
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
