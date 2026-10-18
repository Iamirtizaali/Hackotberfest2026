import React, { FC } from 'react';
import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  MenuDivider,
  Avatar,
  Text
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiGrid, FiHome, FiLogOut } from 'react-icons/fi';
import { useAppSelector } from '@/src/hooks';
import { TesseraMark } from '@/src/components/brand/logo';
import logout from '@/util/logout';

const navLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  height: '30px',
  px: '10px',
  borderRadius: 'tile',
  fontSize: '13px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.85)',
  _hover: { bg: 'rgba(255, 255, 255, 0.14)', color: 'white' }
};

const UserNavBar: FC = () => {
  const user = useAppSelector((state) => state.user);

  return (
    <Box
      as="header"
      height="48px"
      flexShrink={0}
      display="flex"
      alignItems="center"
      px={['8px', '12px']}
      bg="rgba(20, 28, 25, 0.5)"
      sx={{ backdropFilter: 'blur(12px)', gap: '4px' }}>
      <Link href="/home" passHref>
        <Box as="a" aria-label="Tessera home" display="inline-flex" p="6px" mr="4px">
          <TesseraMark size={22} inverted />
        </Box>
      </Link>
      <Link href="/home" passHref>
        <Box as="a" {...navLinkStyle} aria-label="Home">
          <FiHome aria-hidden="true" />
          <Text as="span" ml="6px" display={['none', 'inline']}>
            Home
          </Text>
        </Box>
      </Link>
      <Link href="/boards" passHref>
        <Box as="a" {...navLinkStyle} aria-label="Boards">
          <FiGrid aria-hidden="true" />
          <Text as="span" ml="6px" display={['none', 'inline']}>
            Boards
          </Text>
        </Box>
      </Link>
      <Box flex="1" />
      {user?.isValid && (
        <Menu placement="bottom-end">
          {({ isOpen }) => (
            <>
              <MenuButton aria-label="Account menu" borderRadius="full">
                <Avatar size="sm" name={user?.fullName} bg="white" color="ink" />
              </MenuButton>
              {/* Mounted only while open: a closed, hidden list would still widen the page */}
              {isOpen && (
                <Portal>
                  <MenuList color="ink">
                    <Box px="12px" py="8px">
                      <Text fontSize="13px" fontWeight={600} isTruncated>
                        {user?.fullName}
                      </Text>
                      <Text fontSize="12px" color="muted" isTruncated>
                        {user?.email}
                      </Text>
                    </Box>
                    <MenuDivider borderColor="line" />
                    <MenuItem icon={<FiLogOut />} onClick={logout}>
                      Log out
                    </MenuItem>
                  </MenuList>
                </Portal>
              )}
            </>
          )}
        </Menu>
      )}
    </Box>
  );
};

export default UserNavBar;
