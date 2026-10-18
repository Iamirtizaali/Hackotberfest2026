import Document, { Html, Head, Main, NextScript } from 'next/document';

class TesseraDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* Archivo with its width axis: expanded for display type, normal width for UI */}
          <link
            href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" type="image/svg+xml" href="/tessera-mark.svg" />
          <meta name="theme-color" content="#F4F4F0" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default TesseraDocument;
