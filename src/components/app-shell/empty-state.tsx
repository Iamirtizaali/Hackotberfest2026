import React, { FC, ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
};

// A board outline with one tile waiting to be placed stands in for an illustration
const EmptyBoardGlyph = () => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(3, 22px)"
    gridGap="5px"
    alignItems="start"
    aria-hidden="true">
    {[3, 2, 1].map((count, column) => (
      <Box key={column} display="flex" flexDirection="column" sx={{ gap: '5px' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            height="14px"
            borderRadius="3px"
            bg={column === 2 ? 'transparent' : 'line'}
            border={column === 2 ? '1.5px dashed' : 'none'}
            borderColor="lineStrong"
          />
        ))}
      </Box>
    ))}
  </Box>
);

const EmptyState: FC<Props> = ({ title, description, action }) => {
  return (
    <Box
      bg="marble"
      borderRadius="panel"
      px={['20px', '40px']}
      py={['36px', '52px']}
      display="flex"
      flexDirection={['column', 'row']}
      alignItems={['flex-start', 'center']}
      sx={{ gap: ['20px', '32px'] }}>
      <EmptyBoardGlyph />
      <Box flex="1" minWidth="0">
        <Text as="h2" textStyle="sectionTitle" fontSize="18px">
          {title}
        </Text>
        <Text mt="6px" color="muted" fontSize="15px" maxW="52ch" lineHeight="1.55">
          {description}
        </Text>
      </Box>
      {action && <Box flexShrink={0}>{action}</Box>}
    </Box>
  );
};

export default EmptyState;
