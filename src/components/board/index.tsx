import React from 'react';
import { Box } from '@chakra-ui/react';
import UserNavbar from '@/src/components/user-navbar';
import SubNavbar from '@/src/components/sub-navbar';
import { useAppSelector } from '@/src/hooks';

import BoardColumns from '@/src/components/board/columns';
import PropType from 'prop-types';

const Board = (): JSX.Element => {
  const board = useAppSelector((state) => state.board.board);

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      bg="ink"
      backgroundImage={
        board.backgroundImage
          ? `linear-gradient(180deg, rgba(20, 28, 25, 0.55) 0%, rgba(20, 28, 25, 0.15) 30%, rgba(20, 28, 25, 0.1) 100%), url('${board.backgroundImage}')`
          : undefined
      }
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover">
      <UserNavbar />
      <SubNavbar />
      <BoardColumns />
    </Box>
  );
};

Board.propTypes = {
  board: PropType.object
};

export default Board;
