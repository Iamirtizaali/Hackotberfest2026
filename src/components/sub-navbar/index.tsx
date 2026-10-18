import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { FiChevronRight, FiGrid, FiHome, FiLogOut, FiSettings } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/hooks';
import { fetchUsers } from '@/src/slices/users';
import { AiMark, TesseraMark } from '@/src/components/brand/logo';
import BoardSettings from '@/src/components/sub-navbar/board-settings';
import InviteModal from '@/src/components/sub-navbar/invite-user/modal';
import UnsplashDrawer from '@/src/components/sub-navbar/unsplash-in-drawer';
import { AiPlannerButton, useAiPlanner } from '@/src/components/ai-planner';
import logout from '@/util/logout';

const MAX_AVATARS = 5;

// Narrow screens keep the planner one tap away without its label
const PlannerIconButton = () => {
  const { open } = useAiPlanner();

  return (
    <IconButton
      aria-label="Plan with AI"
      icon={<AiMark size={16} color="#141B4D" />}
      variant="ai"
      size="sm"
      display={['inline-flex', 'inline-flex', 'none']}
      onClick={open}
    />
  );
};

// The board's single bar: where you are on the left, what you can do to the board on the right
const BoardHeader = (): JSX.Element => {
  const board = useAppSelector((state) => state.board.board);
  const users = useAppSelector((state) => state.users.users);
  const user = useAppSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMyAPI() {
      await dispatch(fetchUsers());
    }
    fetchMyAPI();
  }, []);

  const extraMembers = users.length - MAX_AVATARS;

  return (
    <Box
      as="header"
      flexShrink={0}
      bg="night"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      minHeight="56px"
      px={['10px', '16px']}
      sx={{ gap: '12px' }}>
      <Box display="flex" alignItems="center" minWidth="0" sx={{ gap: '6px' }}>
        <Link href="/home" passHref>
          <Box
            as="a"
            aria-label="Tessera home"
            display="inline-flex"
            p="6px"
            borderRadius="control"
            _hover={{ bg: 'whiteAlpha.200' }}>
            <TesseraMark size={22} inverted />
          </Box>
        </Link>
        <Box
          as="nav"
          aria-label="Breadcrumb"
          display="flex"
          alignItems="center"
          minWidth="0"
          sx={{ gap: '4px' }}>
          <Link href="/boards" passHref>
            <Box
              as="a"
              display={['none', 'inline-flex']}
              fontSize="14px"
              color="whiteAlpha.700"
              px="6px"
              py="4px"
              borderRadius="control"
              _hover={{ color: 'white', bg: 'whiteAlpha.200' }}>
              Boards
            </Box>
          </Link>
          <Box display={['none', 'inline-flex']} color="whiteAlpha.500" aria-hidden="true">
            <FiChevronRight size="14px" />
          </Box>
          <Heading
            as="h1"
            color="white"
            fontSize={['16px', '17px']}
            px="6px"
            isTruncated
            sx={{ fontStretch: '112%' }}>
            {board?.name || 'Untitled board'}
          </Heading>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" flexShrink={0} sx={{ gap: '6px' }}>
        <Box
          display={['none', 'none', 'flex']}
          alignItems="center"
          mr="6px"
          role="group"
          aria-label={`${users.length} board ${users.length === 1 ? 'member' : 'members'}`}>
          {users.slice(0, MAX_AVATARS).map((member, index) => (
            <Tooltip label={member.fullName} key={member._id}>
              <Avatar
                size="sm"
                name={member.fullName}
                bg="nightSoft"
                color="white"
                fontWeight={600}
                ml={index === 0 ? 0 : '-8px'}
                border="2px solid"
                borderColor="night"
              />
            </Tooltip>
          ))}
          {extraMembers > 0 && (
            <Text fontSize="13px" color="whiteAlpha.800" ml="6px">
              +{extraMembers}
            </Text>
          )}
        </Box>
        <InviteModal />
        <AiPlannerButton
          size="sm"
          fontSize="13px"
          label="Plan with AI"
          display={['none', 'none', 'inline-flex']}
        />
        <PlannerIconButton />
        <UnsplashDrawer />
        <BoardSettings />
        {user?.isValid && (
          <Menu placement="bottom-end">
            {({ isOpen }) => (
              <>
                <MenuButton
                  aria-label="Account menu"
                  borderRadius="full"
                  ml="4px"
                  _focusVisible={{ boxShadow: '0 0 0 2px #D4A12A' }}>
                  <Avatar size="sm" name={user?.fullName} bg="white" color="night" />
                </MenuButton>
                {/* Mounted only while open: a closed, hidden list would still widen the page */}
                {isOpen && (
                  <Portal>
                    <MenuList color="ink">
                      <Box px="10px" py="8px">
                        <Text fontSize="14px" fontWeight={620} isTruncated>
                          {user?.fullName}
                        </Text>
                        <Text fontSize="13px" color="muted" isTruncated>
                          {user?.email}
                        </Text>
                      </Box>
                      <MenuDivider />
                      <Link href="/home" passHref>
                        <MenuItem as="a" icon={<FiHome />}>
                          Home
                        </MenuItem>
                      </Link>
                      <Link href="/boards" passHref>
                        <MenuItem as="a" icon={<FiGrid />}>
                          All boards
                        </MenuItem>
                      </Link>
                      <Link href="/settings" passHref>
                        <MenuItem as="a" icon={<FiSettings />}>
                          Settings
                        </MenuItem>
                      </Link>
                      <MenuDivider />
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
    </Box>
  );
};

export default BoardHeader;
