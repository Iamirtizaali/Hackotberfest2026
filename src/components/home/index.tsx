import React from 'react';
import Link from 'next/link';
import { Box, Heading, Text } from '@chakra-ui/react';
import { FiPaperclip } from 'react-icons/fi';
import { useAppSelector } from '@/src/hooks';
import PageHeader from '@/src/components/app-shell/page-header';
import EmptyState from '@/src/components/app-shell/empty-state';
import BoardTile from '@/src/components/boards/board-tile';
import CreateBoardModal from '@/src/components/boards/create-board-modal';
import { BoardGrid } from '@/src/components/boards';
import { AiMark } from '@/src/components/brand/logo';
import { useAiPlanner } from '@/src/components/ai-planner';
import parseDate from '@/util/parse-date';

const RECENT_COUNT = 4;

// The home page's main action: a prompt-shaped entry into the planner
const BriefPrompt = () => {
  const { open } = useAiPlanner();

  return (
    <Box
      bg="night"
      color="white"
      borderRadius="panel"
      px={['18px', '28px']}
      py={['22px', '28px']}
      mb={['36px', '44px']}
      display="grid"
      gridTemplateColumns={['1fr', '1fr', '1fr', '5fr 7fr']}
      gridGap={['18px', '18px', '20px', '36px']}
      alignItems="center"
      position="relative"
      overflow="hidden">
      <Box>
        <Box display="flex" alignItems="center" sx={{ gap: '8px' }} color="gold.300">
          <AiMark size={16} />
          <Text fontSize="13px" fontWeight={600}>
            AI planner
          </Text>
        </Box>
        <Heading
          as="h2"
          color="white"
          mt="10px"
          fontSize={['22px', '26px']}
          lineHeight="1.15"
          sx={{ fontStretch: '118%' }}>
          Start a project from a brief
        </Heading>
        <Text mt="8px" color="whiteAlpha.800" fontSize="15px" lineHeight="1.55" maxW="44ch">
          Describe the work or attach a spec. You get a draft board with each card assigned by
          skill, and nothing is added until you approve it.
        </Text>
      </Box>
      <Box
        as="button"
        type="button"
        onClick={open}
        textAlign="left"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        minHeight="112px"
        bg="surface"
        color="muted"
        borderRadius="control"
        px="16px"
        py="14px"
        fontSize="15px"
        boxShadow="0 0 0 0 rgba(212, 161, 42, 0)"
        transition="box-shadow 180ms, transform 180ms"
        _hover={{ boxShadow: '0 0 0 3px rgba(212, 161, 42, 0.55)' }}
        _active={{ transform: 'translateY(1px)' }}>
        <Text as="span">Describe a project, its scope and deadline…</Text>
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt="14px"
          fontSize="13px">
          <Box as="span" display="inline-flex" alignItems="center" sx={{ gap: '6px' }}>
            <FiPaperclip aria-hidden="true" />
            PDF, Word, slides, sheets or images
          </Box>
          <Box
            as="span"
            bg="gold.500"
            color="night"
            fontWeight={600}
            borderRadius="control"
            px="12px"
            py="6px">
            Open planner
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Home = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const boards = useAppSelector((state) => state.boards.boards);

  const firstName = user?.fullName?.split(' ')[0];
  const recentBoards = [...boards]
    .sort(
      (a, b) =>
        (parseDate(b.dateCreated)?.getTime() || 0) - (parseDate(a.dateCreated)?.getTime() || 0)
    )
    .slice(0, RECENT_COUNT);

  return (
    <>
      <PageHeader
        title={firstName ? `Hi, ${firstName}` : 'Home'}
        description="Pick up a board where you left off, or plan something new."
        actions={<CreateBoardModal variant="quiet" />}
      />
      <BriefPrompt />
      <Box display="flex" alignItems="baseline" justifyContent="space-between" mb="16px">
        <Text as="h2" textStyle="sectionTitle">
          Recent boards
        </Text>
        {boards.length > RECENT_COUNT && (
          <Link href="/boards" passHref>
            <Text
              as="a"
              fontSize="14px"
              color="lapis"
              fontWeight={600}
              _hover={{ textDecoration: 'underline' }}>
              All {boards.length} boards
            </Text>
          </Link>
        )}
      </Box>
      {recentBoards.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Boards you create or are invited to show up here, so you can jump straight back in."
          action={<CreateBoardModal label="Create a board" />}
        />
      ) : (
        <BoardGrid>
          {recentBoards.map((board) => (
            <BoardTile key={board._id} board={board} />
          ))}
        </BoardGrid>
      )}
    </>
  );
};

export default Home;
