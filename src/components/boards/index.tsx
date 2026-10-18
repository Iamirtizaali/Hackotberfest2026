import React, { useState } from 'react';
import { Box, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useAppSelector } from '@/src/hooks';
import PageHeader from '@/src/components/app-shell/page-header';
import EmptyState from '@/src/components/app-shell/empty-state';
import BoardTile from '@/src/components/boards/board-tile';
import CreateBoardModal from '@/src/components/boards/create-board-modal';
import { AiPlannerButton } from '@/src/components/ai-planner';

// Show a filter once the grid is long enough to need one
const FILTER_THRESHOLD = 8;

export const BoardGrid: React.FC = ({ children }) => (
  <Box
    display="grid"
    gridTemplateColumns={[
      'repeat(1, minmax(0, 1fr))',
      'repeat(2, minmax(0, 1fr))',
      'repeat(3, minmax(0, 1fr))',
      'repeat(3, minmax(0, 1fr))',
      'repeat(4, minmax(0, 1fr))'
    ]}
    gridColumnGap="20px"
    gridRowGap="28px">
    {children}
  </Box>
);

const Boards = (): JSX.Element => {
  const boards = useAppSelector((state) => state.boards.boards);
  const [query, setQuery] = useState('');

  const visible = query.trim()
    ? boards.filter((b) => (b.name || '').toLowerCase().includes(query.trim().toLowerCase()))
    : boards;

  return (
    <>
      <PageHeader
        title="Boards"
        description={
          boards.length === 1
            ? 'One board. Each board holds the columns and cards for a project.'
            : boards.length
            ? `${boards.length} boards. Each board holds the columns and cards for a project.`
            : 'Each board holds the columns and cards for a project.'
        }
        actions={
          <>
            <AiPlannerButton size="md" fontSize="14px" />
            <CreateBoardModal variant="quiet" />
          </>
        }
      />
      {boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="Create a board for your project, then add columns yourself or let the AI planner draft them from a brief."
          action={<CreateBoardModal label="Create your first board" />}
        />
      ) : (
        <>
          {boards.length > FILTER_THRESHOLD && (
            <InputGroup maxW="320px" mb="24px">
              <InputLeftElement pointerEvents="none" color="muted">
                <FiSearch />
              </InputLeftElement>
              <Input
                type="search"
                aria-label="Filter boards by name"
                placeholder="Filter boards"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          )}
          {visible.length === 0 ? (
            <Text color="muted" fontSize="15px">
              No boards match “{query.trim()}”.
            </Text>
          ) : (
            <BoardGrid>
              {visible.map((board) => (
                <BoardTile key={board._id} board={board} />
              ))}
              {!query.trim() && <CreateBoardModal variant="tile" />}
            </BoardGrid>
          )}
        </>
      )}
    </>
  );
};

export default Boards;
