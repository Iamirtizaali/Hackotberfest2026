import React, { FC } from 'react';
import Link from 'next/link';
import { Box, Text } from '@chakra-ui/react';
import { Board } from '@/src/types/boards';
import parseDate from '@/util/parse-date';

type Props = {
  board: Board;
};

const formatDate = (value?: string) => {
  const date = parseDate(value);

  if (!date) return '';

  return `Created ${date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })}`;
};

const BoardTile: FC<Props> = ({ board }) => {
  return (
    <Link href={{ pathname: '/boards/[slug]', query: { slug: board._id } }} passHref>
      <Box
        as="a"
        display="block"
        bg="surface"
        border="1px solid"
        borderColor="line"
        borderRadius="panel"
        overflow="hidden"
        transition="border-color 120ms, box-shadow 120ms"
        _hover={{ borderColor: 'lineStrong', boxShadow: 'lifted' }}>
        <Box
          height="112px"
          bg="line"
          backgroundImage={board.backgroundImage ? `url('${board.backgroundImage}')` : undefined}
          backgroundPosition="center"
          backgroundSize="cover"
        />
        <Box px="14px" py="12px">
          <Text fontWeight={600} fontSize="15px" isTruncated title={board.name}>
            {board.name || 'Untitled board'}
          </Text>
          <Text fontSize="12px" color="muted" mt="2px" minHeight="18px">
            {formatDate(board.dateCreated)}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

export default BoardTile;
