import React, { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Box, Text } from '@chakra-ui/react';
import TesseraLogo from '@/src/components/brand/logo';

type Props = {
  code?: string;
  title: string;
  description: string;
  actions: ReactNode;
};

// Full-page messages (broken invite links, missing pages): one missing tile on an otherwise full board
const StatusPage: FC<Props> = ({ code, title, description, actions }) => (
  <Box minHeight="100vh" bg="marble" display="flex" flexDirection="column" px="16px">
    <Box maxW="1200px" width="100%" mx="auto" py="20px" px={['0', '8px', '24px']}>
      <Link href="/" passHref>
        <Box as="a" aria-label="Tessera home" display="inline-flex" borderRadius="control">
          <TesseraLogo />
        </Box>
      </Link>
    </Box>
    <Box as="main" flex="1" display="flex" alignItems="center" justifyContent="center" pb="80px">
      <Box maxW="460px">
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 26px)"
          gridGap="6px"
          mb="28px"
          aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <Box
              key={i}
              height="26px"
              borderRadius="5px"
              bg={i === 4 ? 'transparent' : i === 2 ? 'lapis' : 'night'}
              border={i === 4 ? '2px dashed' : 'none'}
              borderColor="lineStrong"
            />
          ))}
        </Box>
        {code && (
          <Text fontSize="14px" fontWeight={600} color="muted" mb="8px">
            Error {code}
          </Text>
        )}
        <Text as="h1" textStyle="pageTitle" fontSize={['28px', '34px']}>
          {title}
        </Text>
        <Text mt="12px" color="muted" fontSize="16px" lineHeight="1.6">
          {description}
        </Text>
        <Box mt="28px" display="flex" flexWrap="wrap" sx={{ gap: '8px' }}>
          {actions}
        </Box>
      </Box>
    </Box>
  </Box>
);

export default StatusPage;
