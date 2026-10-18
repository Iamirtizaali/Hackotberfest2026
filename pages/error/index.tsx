import Link from 'next/link';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import TesseraLogo from '@/src/components/brand/logo';

const ErrorPage = () => {
  return (
    <Box minHeight="100vh" bg="plaster" display="flex" flexDirection="column" px="16px">
      <Box maxW="1200px" width="100%" mx="auto" py="20px">
        <Link href="/" passHref>
          <Box as="a" aria-label="Tessera home" display="inline-flex">
            <TesseraLogo />
          </Box>
        </Link>
      </Box>
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" pb="80px">
        <Box maxW="420px" textAlign="center">
          <Box
            display="flex"
            justifyContent="center"
            sx={{ gap: '6px' }}
            mb="24px"
            aria-hidden="true">
            <Box width="22px" height="22px" borderRadius="5px" bg="ink" />
            <Box width="22px" height="22px" borderRadius="5px" bg="ink" />
            <Box
              width="22px"
              height="22px"
              borderRadius="5px"
              border="2px dashed"
              borderColor="lineStrong"
            />
          </Box>
          <Heading as="h1" fontSize="28px" letterSpacing="-0.03em">
            This link doesn&apos;t work
          </Heading>
          <Text mt="10px" color="muted" fontSize="15px" lineHeight="1.55">
            The invite may have expired or already been used. Ask the board owner to send you a new
            one.
          </Text>
          <Link href="/" passHref>
            <Button as="a" mt="24px" colorScheme="brand">
              Go to Tessera
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ErrorPage;
