import React from 'react';
import { Box } from '@chakra-ui/react';
import BoardHeader from '@/src/components/sub-navbar';
import BoardColumns from '@/src/components/board/columns';
import { AiPlannerProvider } from '@/src/components/ai-planner';
import { useAppSelector } from '@/src/hooks';

const Board = (): JSX.Element => {
  const board = useAppSelector((state) => state.board.board);

  return (
    <AiPlannerProvider>
      <Box height="100vh" display="flex" flexDirection="column" bg="night">
        <BoardHeader />
        {/* The photo is the board's backdrop; a light veil keeps columns readable on any image */}
        <Box
          as="main"
          flex="1"
          minHeight="0"
          display="flex"
          flexDirection="column"
          bg="nightSoft"
          backgroundImage={
            board.backgroundImage
              ? `linear-gradient(180deg, rgba(20, 27, 77, 0.35) 0%, rgba(20, 27, 77, 0.05) 28%, rgba(20, 27, 77, 0) 100%), url('${board.backgroundImage}')`
              : undefined
          }
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover">
          <BoardColumns />
        </Box>
      </Box>
    </AiPlannerProvider>
  );
};

export default Board;
