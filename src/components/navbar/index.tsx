import React, { FC } from 'react';
import { Button, Flex, Box } from '@chakra-ui/react';
import Link from 'next/link';
import { useAppSelector } from '@/src/hooks';
import TesseraLogo from '@/src/components/brand/logo';
import logout from '@/util/logout';

const NavBar: FC = () => {
  const user = useAppSelector((state) => state.user);

  const renderButtons = () => {
    if (user?.isValid) {
      return (
        <>
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
          <Link href="/boards" passHref>
            <Button as="a" size="sm" bg="ink" color="white" _hover={{ bg: '#2E3B36' }}>
              Open boards
            </Button>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/login" passHref>
          <Button as="a" variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/signup" passHref>
          <Button as="a" size="sm" bg="ink" color="white" _hover={{ bg: '#2E3B36' }}>
            Sign up
          </Button>
        </Link>
      </>
    );
  };

  return (
    <Box as="header" px={['16px', '24px', '40px']} py="20px">
      <Flex maxW="1200px" mx="auto" alignItems="center" justifyContent="space-between">
        <Link href="/" passHref>
          <Box as="a" aria-label="Tessera home">
            <TesseraLogo />
          </Box>
        </Link>
        <Flex alignItems="center" sx={{ gap: '8px' }}>
          {renderButtons()}
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
