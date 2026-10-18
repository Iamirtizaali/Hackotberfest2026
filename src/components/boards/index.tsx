import React from 'react';
import { Box } from '@chakra-ui/react';
import { useAppSelector } from '@/src/hooks';
import PageHeader from '@/src/components/app-shell/page-header';
import EmptyState from '@/src/components/app-shell/empty-state';
import BoardTile from '@/src/components/boards/board-tile';
import CreateBoardModal from '@/src/components/boards/create-board-modal';

const Boards = (): JSX.Element => {
  const boards = useAppSelector((state) => state.boards.boards);

  return (
    <>
      <PageHeader
        title="Boards"
        description={
          boards.length === 1 ? '1 board' : boards.length ? `${boards.length} boards` : undefined
        }
        actions={<CreateBoardModal />}
      />
      {boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="A board holds the columns and cards for one project. Create one to get started."
          action={<CreateBoardModal label="Create your first board" />}
        />
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
          gridGap="16px">
          {boards.map((board) => (
            <BoardTile key={board._id} board={board} />
          ))}
        </Box>
      )}
    </>
  );
};

export default Boards;
