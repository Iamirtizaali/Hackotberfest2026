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
        role="group"
        borderRadius="panel"
        _focusVisible={{ outline: '2px solid #2B44C7', outlineOffset: '3px' }}>
        <Box
          position="relative"
          paddingTop="58%"
          borderRadius="panel"
          overflow="hidden"
          bg="night"
          border="1px solid"
          borderColor="line"
          transition="box-shadow 220ms, transform 220ms"
          _groupHover={{ boxShadow: 'raised', transform: 'translateY(-2px)' }}>
          {board.backgroundImage && (
            <Box
              position="absolute"
              inset="0"
              backgroundImage={`url('${board.backgroundImage}')`}
              backgroundPosition="center"
              backgroundSize="cover"
              transition="transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1)"
              _groupHover={{ transform: 'scale(1.04)' }}
            />
          )}
        </Box>
        <Box pt="10px" px="2px">
          <Text
            fontWeight={620}
            fontSize="15px"
            isTruncated
            title={board.name}
            _groupHover={{ color: 'lapis' }}
            transition="color 140ms">
            {board.name || 'Untitled board'}
          </Text>
          <Text fontSize="13px" color="muted" mt="1px" minHeight="19px">
            {formatDate(board.dateCreated)}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};

export default BoardTile;
