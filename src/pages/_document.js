import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      {/* TODO: don't use style */}
      <body style={{margin: 0}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
