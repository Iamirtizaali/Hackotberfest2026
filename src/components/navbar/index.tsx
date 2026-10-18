import React, { FC } from 'react';
import { Button, Flex, Box } from '@chakra-ui/react';
import Link from 'next/link';
import { useAppSelector } from '@/src/hooks';
import TesseraLogo from '@/src/components/brand/logo';
import logout from '@/util/logout';

type Props = {
  // On the lapis hero the logo and links flip to white
  inverted?: boolean;
};

const NavBar: FC<Props> = ({ inverted = false }) => {
  const user = useAppSelector((state) => state.user);
  const ghost = inverted
    ? { variant: 'ghost', color: 'white', _hover: { bg: 'whiteAlpha.200' } }
    : { variant: 'ghost' };
  const solid = inverted
    ? { bg: 'white', color: 'night', _hover: { bg: 'gold.100' } }
    : { colorScheme: 'brand' };

  const renderButtons = () => {
    if (user?.isValid) {
      return (
        <>
          <Button size="sm" {...ghost} onClick={logout}>
            Log out
          </Button>
          <Link href="/home" passHref>
            <Button as="a" size="sm" {...solid}>
              Open Tessera
            </Button>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/login" passHref>
          <Button as="a" size="sm" {...ghost}>
            Log in
          </Button>
        </Link>
        <Link href="/signup" passHref>
          <Button as="a" size="sm" {...solid}>
            Sign up
          </Button>
        </Link>
      </>
    );
  };

  return (
    <Box as="header" px={['16px', '24px', '40px']} py="18px">
      <Flex maxW="1200px" mx="auto" alignItems="center" justifyContent="space-between">
        <Link href="/" passHref>
          <Box as="a" aria-label="Tessera home" borderRadius="control">
            <TesseraLogo inverted={inverted} />
          </Box>
        </Link>
        <Flex as="nav" aria-label="Account" alignItems="center" sx={{ gap: '6px' }}>
          {renderButtons()}
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
