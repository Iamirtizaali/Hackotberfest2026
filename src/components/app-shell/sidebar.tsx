import React, { FC } from 'react';
import Link from 'next/link';
import { Avatar, Box, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { FiHome, FiGrid, FiLayout, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAppSelector } from '@/src/hooks';
import TesseraLogo from '@/src/components/brand/logo';
import logout from '@/util/logout';

type Props = {
  page: string;
};

const menu = [
  { path: '/home', name: 'Home', page: 'home', icon: FiHome },
  { path: '/boards', name: 'Boards', page: 'boards', icon: FiGrid },
  { path: '/templates', name: 'Templates', page: 'templates', icon: FiLayout },
  { path: '/settings', name: 'Settings', page: 'settings', icon: FiSettings }
];

const Sidebar: FC<Props> = ({ page }) => {
  const user = useAppSelector((state) => state.user);

  return (
    <Box
      as="aside"
      width={['100%', '100%', '248px']}
      flexShrink={0}
      bg="surface"
      borderRight={['none', 'none', '1px solid #E3E5E0']}
      borderBottom={['1px solid #E3E5E0', '1px solid #E3E5E0', 'none']}
      borderColor="line"
      position={['sticky', 'sticky', 'sticky']}
      top="0"
      zIndex={10}
      height={['auto', 'auto', '100vh']}
      display="flex"
      flexDirection={['row', 'row', 'column']}
      alignItems={['center', 'center', 'stretch']}
      px={['12px', '16px', '16px']}
      py={['10px', '10px', '24px']}>
      <Box px={['4px', '4px', '8px']} pb={['0', '0', '28px']} flexShrink={0}>
        <Link href="/home" passHref>
          <Box as="a" aria-label="Tessera home" display="inline-flex">
            <TesseraLogo size={22} fontSize="19px" />
          </Box>
        </Link>
      </Box>

      <Box
        as="nav"
        aria-label="Main"
        display="flex"
        flexDirection={['row', 'row', 'column']}
        flex="1"
        justifyContent={['center', 'center', 'flex-start']}
        overflowX={['auto', 'auto', 'visible']}
        sx={{ gap: '2px' }}>
        {menu.map((item) => {
          const isActive = page === item.page;

          return (
            <Link href={item.path} key={item.path} passHref>
              <Box
                as="a"
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.name}
                display="flex"
                alignItems="center"
                sx={{ gap: '10px' }}
                height="36px"
                px="10px"
                borderRadius="tile"
                fontSize="14px"
                fontWeight={isActive ? 600 : 500}
                color={isActive ? 'ink' : 'muted'}
                bg={isActive ? 'plaster' : 'transparent'}
                position="relative"
                transition="background-color 120ms, color 120ms"
                _hover={{ bg: 'plaster', color: 'ink' }}>
                <item.icon size="16px" aria-hidden="true" />
                <Text as="span" display={['none', 'inline', 'inline']}>
                  {item.name}
                </Text>
                {isActive && (
                  <Box
                    as="span"
                    aria-hidden="true"
                    display={['none', 'none', 'block']}
                    position="absolute"
                    right="10px"
                    width="6px"
                    height="6px"
                    borderRadius="1.5px"
                    bg="lapis"
                    transform="rotate(12deg)"
                  />
                )}
              </Box>
            </Link>
          );
        })}
      </Box>

      <Box
        display="flex"
        alignItems="center"
        sx={{ gap: '10px' }}
        pt={['0', '0', '16px']}
        px={['0', '0', '6px']}
        borderTop={['none', 'none', '1px solid #E3E5E0']}
        borderColor="line"
        flexShrink={0}>
        <Avatar size="sm" name={user?.fullName} bg="ink" color="white" />
        <Box minWidth="0" flex="1" display={['none', 'none', 'block']}>
          <Text fontSize="13px" fontWeight={600} isTruncated>
            {user?.fullName}
          </Text>
          <Text fontSize="12px" color="muted" isTruncated>
            {user?.email}
          </Text>
        </Box>
        <Tooltip label="Log out">
          <IconButton
            aria-label="Log out"
            icon={<FiLogOut />}
            size="sm"
            variant="ghost"
            color="muted"
            onClick={logout}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;
