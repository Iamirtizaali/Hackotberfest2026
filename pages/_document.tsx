import Document, { Html, Head, Main, NextScript } from 'next/document';

class TesseraDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..700&family=Geist:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" type="image/svg+xml" href="/tessera-mark.svg" />
          <meta name="theme-color" content="#F2F3EF" />
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
