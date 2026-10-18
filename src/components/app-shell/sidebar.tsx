import React, { FC, useEffect } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Text,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react';
import { FiHome, FiGrid, FiLayout, FiSettings, FiLogOut, FiMenu } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/hooks';
import { fetchBoards } from '@/src/slices/boards';
import TesseraLogo from '@/src/components/brand/logo';
import { AiMark } from '@/src/components/brand/logo';
import { AiPlannerButton, useAiPlanner } from '@/src/components/ai-planner';
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

const MAX_SHORTCUTS = 6;

const NavLink: FC<{ href: string; isActive?: boolean; onNavigate?: () => void }> = ({
  href,
  isActive,
  onNavigate,
  children
}) => (
  <Link href={href} passHref>
    <Box
      as="a"
      aria-current={isActive ? 'page' : undefined}
      display="flex"
      alignItems="center"
      sx={{ gap: '10px' }}
      minHeight="38px"
      px="10px"
      borderRadius="control"
      fontSize="14px"
      fontWeight={isActive ? 620 : 500}
      color={isActive ? 'ink' : 'muted'}
      bg={isActive ? 'surface' : 'transparent'}
      boxShadow={isActive ? 'tile' : 'none'}
      transition="background-color 140ms, color 140ms, box-shadow 140ms"
      _hover={{ bg: isActive ? 'surface' : 'rgba(23, 28, 46, 0.05)', color: 'ink' }}
      onClick={onNavigate}>
      {children}
    </Box>
  </Link>
);

// Everything the sidebar holds; rendered in the desktop rail and the mobile drawer alike
const SidebarContent: FC<Props & { onNavigate?: () => void }> = ({ page, onNavigate }) => {
  const user = useAppSelector((state) => state.user);
  const boards = useAppSelector((state) => state.boards.boards);
  const { open } = useAiPlanner();

  const shortcuts = (boards || []).slice(0, MAX_SHORTCUTS);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box px="10px" pt="4px" pb="22px">
        <Link href="/home" passHref>
          <Box as="a" aria-label="Tessera home" display="inline-flex" onClick={onNavigate}>
            <TesseraLogo size={22} fontSize="19px" />
          </Box>
        </Link>
      </Box>

      <AiPlannerButton
        width="100%"
        justifyContent="flex-start"
        size="md"
        fontSize="14px"
        onClick={() => {
          onNavigate?.();
          open();
        }}
      />

      <Box as="nav" aria-label="Main" display="flex" flexDirection="column" mt="18px">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            href={item.path}
            isActive={page === item.page}
            onNavigate={onNavigate}>
            <item.icon size="16px" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </Box>

      {shortcuts.length > 0 && (
        <Box as="nav" aria-label="Your boards" mt="26px" minHeight="0" overflowY="auto">
          <Text fontSize="12px" fontWeight={600} color="muted" px="10px" mb="6px">
            Your boards
          </Text>
          {shortcuts.map((board) => (
            <Link
              key={board._id}
              href={{ pathname: '/boards/[slug]', query: { slug: board._id } }}
              passHref>
              <Box
                as="a"
                display="flex"
                alignItems="center"
                sx={{ gap: '10px' }}
                minHeight="34px"
                px="10px"
                borderRadius="control"
                fontSize="14px"
                color="ink"
                transition="background-color 140ms"
                _hover={{ bg: 'rgba(23, 28, 46, 0.05)' }}
                onClick={onNavigate}>
                <Box
                  as="span"
                  width="14px"
                  height="14px"
                  flexShrink={0}
                  borderRadius="3px"
                  bg="lineStrong"
                  backgroundImage={
                    board.backgroundImage ? `url('${board.backgroundImage}')` : undefined
                  }
                  backgroundSize="cover"
                  backgroundPosition="center"
                  aria-hidden="true"
                />
                <Text as="span" isTruncated>
                  {board.name || 'Untitled board'}
                </Text>
              </Box>
            </Link>
          ))}
        </Box>
      )}

      <Box flex="1" />

      <Box
        display="flex"
        alignItems="center"
        sx={{ gap: '10px' }}
        mt="16px"
        pt="14px"
        px="6px"
        borderTop="1px solid"
        borderColor="line">
        <Avatar size="sm" name={user?.fullName} bg="night" color="white" />
        <Box minWidth="0" flex="1">
          <Text fontSize="13px" fontWeight={620} isTruncated>
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

const Sidebar: FC<Props> = ({ page }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const userId = useAppSelector((state) => state.user.id);
  const boards = useAppSelector((state) => state.boards.boards);
  const { open } = useAiPlanner();

  // Settings and Templates don't load boards on the server; fetch them for the shortcuts
  useEffect(() => {
    if (userId && (!boards || boards.length === 0)) dispatch(fetchBoards());
  }, [userId]);

  return (
    <>
      {/* Desktop rail */}
      <Box
        as="aside"
        display={['none', 'none', 'none', 'block']}
        width="256px"
        flexShrink={0}
        position="sticky"
        top="0"
        height="100vh"
        px="14px"
        py="20px">
        <SidebarContent page={page} />
      </Box>

      {/* Mobile and tablet top bar */}
      <Box
        as="header"
        display={['flex', 'flex', 'flex', 'none']}
        position="sticky"
        top="0"
        zIndex={20}
        alignItems="center"
        justifyContent="space-between"
        height="56px"
        px="12px"
        bg="rgba(244, 244, 240, 0.92)"
        borderBottom="1px solid"
        borderColor="line"
        sx={{ backdropFilter: 'saturate(1.4) blur(8px)' }}>
        <Box display="flex" alignItems="center" sx={{ gap: '4px' }}>
          <IconButton
            aria-label="Open navigation"
            icon={<FiMenu />}
            variant="ghost"
            onClick={onOpen}
          />
          <Link href="/home" passHref>
            <Box as="a" aria-label="Tessera home" display="inline-flex">
              <TesseraLogo size={20} fontSize="18px" />
            </Box>
          </Link>
        </Box>
        <IconButton
          aria-label="Plan with AI"
          icon={<AiMark size={18} color="#141B4D" />}
          variant="ai"
          onClick={open}
        />
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="300px" bg="marble">
          <DrawerCloseButton top="16px" />
          <DrawerBody px="14px" py="20px">
            <SidebarContent page={page} onNavigate={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
