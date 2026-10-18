import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import '@/src/styles/default.css';
import PropTypes from 'prop-types';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';
import theme from '@/src/theme';

import 'nprogress/nprogress.css';

const TesseraApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Tessera</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Tessera is a simple board for planning work with cards and columns."
        />
      </Head>
      <NextNprogress
        color="#2B44C7"
        startPosition={0.3}
        stopDelayMs={200}
        height={2}
        options={{ showSpinner: false }}
      />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
};

TesseraApp.propTypes = {
  pageProps: PropTypes.object
};

export default TesseraApp;
