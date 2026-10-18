import React, { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Box, Text } from '@chakra-ui/react';
import TesseraLogo, { AiMark } from '@/src/components/brand/logo';

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

// A still board on the lapis ground: white tiles are cards people wrote, gold ones the planner drafted
const columns = [
  ['w', 'g', 'w', 'w'],
  ['g', 'w', 'g'],
  ['w', 'w', 'g', 'w', 'w']
];

const AuthArt = () => (
  <Box
    display={['none', 'none', 'none', 'flex']}
    flexDirection="column"
    justifyContent="space-between"
    bg="night"
    color="white"
    m="10px"
    borderRadius="sheet"
    p="48px"
    overflow="hidden"
    position="relative">
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gridGap="14px"
      alignItems="start"
      width="78%"
      maxW="420px"
      mt="24px"
      aria-hidden="true">
      {columns.map((tiles, c) => (
        <Box
          key={c}
          bg="rgba(255, 255, 255, 0.06)"
          borderRadius="8px"
          p="8px"
          display="flex"
          flexDirection="column"
          sx={{ gap: '8px' }}>
          <Box
            height="6px"
            width="55%"
            borderRadius="2px"
            bg="rgba(255, 255, 255, 0.35)"
            mb="2px"
          />
          {tiles.map((tone, i) => (
            <Box
              key={i}
              height={`${28 + ((c * 3 + i * 5) % 3) * 10}px`}
              borderRadius="4px"
              bg={tone === 'g' ? 'gold.500' : 'rgba(255, 255, 255, 0.9)'}
              transform={c === 1 && i === 1 ? 'rotate(-4deg) translateX(-6px)' : undefined}
              boxShadow={c === 1 && i === 1 ? '0 16px 28px -12px rgba(0, 0, 0, 0.5)' : undefined}
            />
          ))}
        </Box>
      ))}
    </Box>
    <Box maxW="34ch">
      <Box color="gold.300">
        <AiMark size={20} />
      </Box>
      <Text
        mt="14px"
        fontSize="26px"
        fontWeight={700}
        lineHeight="1.15"
        letterSpacing="-0.025em"
        sx={{ fontStretch: '120%' }}>
        Describe a project once. Get a board with an owner on every card.
      </Text>
      <Text mt="12px" color="whiteAlpha.700" fontSize="15px" lineHeight="1.6">
        Gold cards were drafted by the planner. You approve them before they reach the board.
      </Text>
    </Box>
  </Box>
);

const AuthLayout: FC<Props> = ({ title, description, children }) => {
  return (
    <Box
      minHeight="100vh"
      display="grid"
      gridTemplateColumns={['1fr', '1fr', '1fr', 'minmax(0, 1fr) minmax(0, 1fr)']}
      bg="surface">
      <Box display="flex" flexDirection="column" px={['16px', '32px', '56px']} py="24px">
        <Link href="/" passHref>
          <Box as="a" aria-label="Tessera home" alignSelf="flex-start" borderRadius="control">
            <TesseraLogo />
          </Box>
        </Link>
        <Box
          as="main"
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={['40px', '56px']}>
          <Box width="100%" maxW="400px">
            <Text as="h1" textStyle="pageTitle" fontSize={['28px', '34px']}>
              {title}
            </Text>
            <Text mt="10px" color="muted" fontSize="16px" lineHeight="1.5">
              {description}
            </Text>
            <Box mt="32px">{children}</Box>
          </Box>
        </Box>
      </Box>
      <AuthArt />
    </Box>
  );
};

export default AuthLayout;
