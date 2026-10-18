import React from 'react';
import Link from 'next/link';
import NavBar from '@/src/components/navbar';
import MosaicBoard from '@/src/components/welcome-screen/mosaic-board';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

const WelcomeScreen = (): JSX.Element => {
  return (
    <Box minHeight="100vh" bg="plaster" display="flex" flexDirection="column">
      <NavBar />
      <Box as="main" flex="1" display="flex" alignItems="center" px={['16px', '24px', '40px']}>
        <Box
          maxW="1200px"
          mx="auto"
          width="100%"
          display="grid"
          gridTemplateColumns={['1fr', '1fr', '1fr', '5fr 6fr']}
          gridGap={['48px', '48px', '56px', '72px']}
          alignItems="center"
          py={['32px', '48px', '64px']}>
          <Box>
            <Heading
              as="h1"
              fontSize={['44px', '56px', '64px', '72px']}
              lineHeight="0.98"
              letterSpacing="-0.045em"
              fontWeight={600}
              maxW="11ch">
              Plan work in pieces you can move.
            </Heading>
            <Text mt="24px" fontSize={['17px', '19px']} lineHeight="1.55" color="muted" maxW="38ch">
              Tessera turns a project into a board of cards. Write tasks down, sort them into
              columns, and drag them along as they get done.
            </Text>
            <Flex mt="36px" sx={{ gap: '12px' }} flexWrap="wrap">
              <Link href="/signup" passHref>
                <Button as="a" colorScheme="brand" size="lg" fontSize="md" px="24px">
                  Create an account
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button
                  as="a"
                  size="lg"
                  fontSize="md"
                  variant="outline"
                  borderColor="lineStrong"
                  bg="surface">
                  Log in
                </Button>
              </Link>
            </Flex>
          </Box>
          <MosaicBoard />
        </Box>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;
