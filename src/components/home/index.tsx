import React from 'react';
import Link from 'next/link';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useAppSelector } from '@/src/hooks';
import PageHeader from '@/src/components/app-shell/page-header';
import EmptyState from '@/src/components/app-shell/empty-state';
import BoardTile from '@/src/components/boards/board-tile';
import CreateBoardModal from '@/src/components/boards/create-board-modal';
import parseDate from '@/util/parse-date';

const Home = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const boards = useAppSelector((state) => state.boards.boards);

  const firstName = user?.fullName?.split(' ')[0];
  const recentBoards = [...boards]
    .sort(
      (a, b) =>
        (parseDate(b.dateCreated)?.getTime() || 0) - (parseDate(a.dateCreated)?.getTime() || 0)
    )
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title={firstName ? `Hi, ${firstName}` : 'Home'}
        description="Pick up where you left off."
        actions={<CreateBoardModal />}
      />
      <Box display="flex" alignItems="baseline" justifyContent="space-between" mb="14px">
        <Heading as="h2" fontSize="16px" letterSpacing="-0.01em">
          Recent boards
        </Heading>
        {boards.length > 4 && (
          <Link href="/boards" passHref>
            <Text as="a" fontSize="14px" color="lapis" fontWeight={500}>
              See all boards
            </Text>
          </Link>
        )}
      </Box>
      {recentBoards.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Boards you create will show up here so you can jump back in."
          action={<CreateBoardModal label="Create a board" />}
        />
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
          gridGap="16px">
          {recentBoards.map((board) => (
            <BoardTile key={board._id} board={board} />
          ))}
        </Box>
      )}
    </>
  );
};

export default Home;
