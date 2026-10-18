import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import '@/src/styles/default.css';
import PropTypes from 'prop-types';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';
import theme from '@/src/theme';

import 'nprogress/nprogress.css';

const TesseraApp = ({ Component, pageProps, router }) => {
  return (
    <>
      <Head>
        <title>Tessera</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Tessera turns a project brief into a board of task cards, each assigned to the teammate whose skills fit."
        />
      </Head>
      <NextNprogress
        color="#D4A12A"
        startPosition={0.3}
        stopDelayMs={200}
        height={2}
        options={{ showSpinner: false }}
      />
      <ChakraProvider theme={theme}>
        {/* Route changes fade in; there is no exit animation, so navigation never waits.
            See .page-enter in default.css for why it leaves no transform behind. */}
        <div key={router.pathname} className="page-enter">
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </>
  );
};

TesseraApp.propTypes = {
  pageProps: PropTypes.object
};

export default TesseraApp;
