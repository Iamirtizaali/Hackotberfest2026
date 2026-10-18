import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// The landing page's one moment of motion: tiles settle into a board as the page loads.
const settle = keyframes`
  from {
    opacity: 0;
    transform: translate(var(--dx), var(--dy)) rotate(var(--r));
  }
  to {
    opacity: 1;
    transform: translate(0, 0) rotate(var(--rest, 0deg));
  }
`;

type Tile = {
  title: string;
  tone: 'plain' | 'lapis' | 'ochre' | 'verdigris' | 'rose' | 'ink';
  height: number;
  lifted?: boolean;
};

const columns: { name: string; tiles: Tile[] }[] = [
  {
    name: 'To do',
    tiles: [
      { title: 'Write launch post', tone: 'plain', height: 64 },
      { title: 'Pick a date for the team offsite', tone: 'lapis', height: 92, lifted: true },
      { title: 'Book user interviews', tone: 'plain', height: 64 },
      { title: 'Update pricing', tone: 'ochre', height: 52 }
    ]
  },
  {
    name: 'Doing',
    tiles: [
      { title: 'Fix sign-in redirect', tone: 'rose', height: 76 },
      { title: 'Onboarding checklist', tone: 'plain', height: 64 },
      { title: 'Design new settings page', tone: 'plain', height: 104 }
    ]
  },
  {
    name: 'Done',
    tiles: [
      { title: 'Ship dark mode', tone: 'verdigris', height: 56 },
      { title: 'Q3 roadmap review', tone: 'plain', height: 64 },
      { title: 'Hire a designer', tone: 'ink', height: 72 },
      { title: 'Clean up old boards', tone: 'plain', height: 52 }
    ]
  }
];

const tones = {
  plain: { bg: 'white', color: 'ink', border: '1px solid #E3E5E0' },
  lapis: { bg: '#2B44C7', color: 'white', border: 'none' },
  ochre: { bg: '#C99227', color: 'white', border: 'none' },
  verdigris: { bg: '#2C8A6E', color: 'white', border: 'none' },
  rose: { bg: '#C7405A', color: 'white', border: 'none' },
  ink: { bg: '#1E2925', color: 'white', border: 'none' }
};

// Deterministic scatter so server and client render the same start positions
const scatter = (i: number) => {
  const dx = ((i * 37) % 60) - 30;
  const dy = ((i * 53) % 50) - 10 + 24;
  const r = ((i * 29) % 24) - 12;

  return { dx: `${dx}px`, dy: `${dy}px`, r: `${r}deg` };
};

const MosaicBoard = (): JSX.Element => {
  let order = 0;

  return (
    <Box
      role="img"
      aria-label="A Tessera board with three columns of task cards"
      bg="#E8EAE4"
      borderRadius="16px"
      p={['12px', '16px', '20px']}
      display="grid"
      gridTemplateColumns="repeat(3, minmax(0, 1fr))"
      gridGap={['8px', '12px', '14px']}
      alignItems="start"
      width="100%">
      {columns.map((column) => (
        <Box key={column.name} display="flex" flexDirection="column" sx={{ gap: '8px' }}>
          <Text fontSize={['11px', '13px']} fontWeight={500} color="muted" px="2px" pb="2px">
            {column.name}
          </Text>
          {column.tiles.map((tile) => {
            const i = order++;
            const { dx, dy, r } = scatter(i);
            const tone = tones[tile.tone];

            return (
              <Box
                key={tile.title}
                height={[`${tile.height * 0.75}px`, `${tile.height}px`]}
                bg={tone.bg}
                color={tone.color}
                border={tone.border}
                borderRadius="6px"
                p={['8px', '10px 12px']}
                fontSize={['11px', '13px']}
                lineHeight="1.35"
                fontWeight={500}
                overflow="hidden"
                boxShadow={tile.lifted ? 'lifted' : 'tile'}
                position="relative"
                zIndex={tile.lifted ? 1 : 0}
                sx={{
                  '--dx': dx,
                  '--dy': dy,
                  '--r': r,
                  '--rest': tile.lifted ? '3deg' : '0deg',
                  transform: `rotate(var(--rest))`,
                  animation: `${settle} 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both`,
                  animationDelay: `${120 + i * 55}ms`
                }}>
                {tile.title}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MosaicBoard;
