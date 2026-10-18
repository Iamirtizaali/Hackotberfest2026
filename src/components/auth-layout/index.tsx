import React, { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Box, Heading, Text } from '@chakra-ui/react';
import TesseraLogo from '@/src/components/brand/logo';

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

// A static mosaic of tiles shown beside the auth forms on wide screens
const pattern = ['abbcba', 'bdbbab', 'cbabbe', 'babfbb', 'bbebab', 'abbabc', 'bfbbdb', 'bbabba']
  .join('')
  .split('');

const tileColors = {
  a: 'rgba(255, 255, 255, 0.14)',
  b: 'rgba(255, 255, 255, 0.06)',
  c: '#C99227',
  d: '#FFFFFF',
  e: '#2C8A6E',
  f: '#1E2925'
};

const AuthLayout: FC<Props> = ({ title, description, children }) => {
  return (
    <Box
      minHeight="100vh"
      display="grid"
      gridTemplateColumns={['1fr', '1fr', '1fr', '1fr 1fr']}
      bg="surface">
      <Box display="flex" flexDirection="column" px={['16px', '32px', '56px']} py="28px">
        <Link href="/" passHref>
          <Box as="a" aria-label="Tessera home" alignSelf="flex-start">
            <TesseraLogo />
          </Box>
        </Link>
        <Box flex="1" display="flex" alignItems="center" justifyContent="center" py="48px">
          <Box width="100%" maxW="380px">
            <Heading as="h1" fontSize={['28px', '32px']} letterSpacing="-0.035em">
              {title}
            </Heading>
            <Text mt="8px" color="muted" fontSize="15px">
              {description}
            </Text>
            <Box mt="32px">{children}</Box>
          </Box>
        </Box>
      </Box>
      <Box
        display={['none', 'none', 'none', 'flex']}
        bg="lapis"
        m="12px"
        borderRadius="16px"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        aria-hidden="true">
        <Box
          display="grid"
          gridTemplateColumns="repeat(6, 1fr)"
          gridGap="10px"
          width="72%"
          maxW="440px"
          transform="rotate(-6deg)">
          {pattern.map((tone, index) => (
            <Box
              key={index}
              paddingTop="100%"
              borderRadius="6px"
              bg={tileColors[tone]}
              transform={index === 20 ? 'rotate(14deg)' : undefined}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
