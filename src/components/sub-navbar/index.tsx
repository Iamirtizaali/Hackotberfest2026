import { Box, Heading, Avatar, Tooltip } from '@chakra-ui/react';

import BoardSettings from '@/src/components/sub-navbar/board-settings';
import InviteModal from '@/src/components/sub-navbar/invite-user/modal';
import React, { useEffect } from 'react';
import { useAppSelector } from '@/src/hooks';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '@/src/slices/users';

import UnsplashDrawer from '@/src/components/sub-navbar/unsplash-in-drawer';
import AiPlanner from '@/src/components/ai-planner';
import { onPhotoButton } from '@/src/components/sub-navbar/on-photo-button';

const SubNavbar = (): JSX.Element => {
  const board = useAppSelector((state) => state.board.board);
  const users = useAppSelector((state) => state.users.users);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchMyAPI() {
      await dispatch(fetchUsers());
    }
    fetchMyAPI();
  }, []);

  return (
    <Box
      flexShrink={0}
      minHeight="60px"
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="space-between"
      px={['12px', '20px']}
      py="10px"
      sx={{ gap: '12px' }}>
      <Heading
        as="h1"
        color="white"
        fontSize={['18px', '20px']}
        letterSpacing="-0.025em"
        isTruncated
        maxW={['100%', '50%']}
        textShadow="0 1px 12px rgba(0,0,0,0.25)">
        {board?.name}
      </Heading>
      <Box display="flex" alignItems="center" sx={{ gap: '8px' }}>
        <Box display="flex" mr="4px" aria-label="Board members">
          {users.slice(0, 5).map((user, index) => (
            <Tooltip label={user.fullName} key={user._id}>
              <Avatar
                size="sm"
                name={user.fullName}
                bg="white"
                color="ink"
                fontWeight={600}
                ml={index === 0 ? 0 : '-6px'}
                border="2px solid rgba(20, 28, 25, 0.35)"
              />
            </Tooltip>
          ))}
        </Box>
        <InviteModal />
        <AiPlanner buttonProps={onPhotoButton} />
        <UnsplashDrawer />
        <BoardSettings />
      </Box>
    </Box>
  );
};

export default SubNavbar;
