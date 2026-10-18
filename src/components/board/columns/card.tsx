import React, { FC } from 'react';
import { Box, Avatar, Text } from '@chakra-ui/react';
import { Draggable } from 'react-beautiful-dnd';
import { CardDetail } from '@/src/types/cards';
import { useAppSelector } from '@/src/hooks';
import LabelChip from '@/src/components/board/columns/label-chip';

type Props = {
  showCardDetail: (cardId: string) => void;
  cardIndex: number;
  card: CardDetail;
};

const Card: FC<Props> = ({ cardIndex, showCardDetail, card }) => {
  const users = useAppSelector((state) => state.users.users);
  const assignee = card.assignedTo ? users.find((user) => user._id === card.assignedTo) : null;

  return (
    // https://github.com/atlassian/react-beautiful-dnd/issues/1767
    <Draggable draggableId={card._id} index={cardIndex} key={card._id}>
      {(provided, snapshot) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          id={card._id}
          role="button"
          aria-label={`Open card ${card.title || 'Untitled card'}`}
          mb="8px"
          px="12px"
          py="10px"
          bg="surface"
          border="1px solid"
          borderColor={snapshot.isDragging ? 'lineStrong' : 'line'}
          borderRadius="tile"
          boxShadow={snapshot.isDragging ? 'lifted' : 'tile'}
          cursor="pointer"
          transition="border-color 120ms"
          _hover={{ borderColor: 'lineStrong' }}
          onClick={() => showCardDetail(card._id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') showCardDetail(card._id);
          }}>
          {card.label?.type && (
            <Box mb="6px">
              <LabelChip type={card.label.type} />
            </Box>
          )}
          <Text fontSize="14px" lineHeight="1.4" wordBreak="break-word">
            {card.title || 'Untitled card'}
          </Text>
          {assignee && (
            <Box display="flex" justifyContent="flex-end" mt="8px">
              <Avatar size="xs" name={assignee.fullName} bg="ink" color="white" />
            </Box>
          )}
        </Box>
      )}
    </Draggable>
  );
};

export default Card;
