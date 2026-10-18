import React, { FC } from 'react';
import { Box, Avatar, Text, Tooltip } from '@chakra-ui/react';
import { FiAlignLeft } from 'react-icons/fi';
import { Draggable } from 'react-beautiful-dnd';
import { CardDetail } from '@/src/types/cards';
import { useAppSelector } from '@/src/hooks';
import LabelChip from '@/src/components/board/columns/label-chip';

type Props = {
  showCardDetail: (cardId: string) => void;
  cardIndex: number;
  card: CardDetail;
};

// Quill leaves "<p><br></p>" behind in an emptied editor, so look for real text
const hasDescription = (html?: string) => !!html && html.replace(/<[^>]*>/g, '').trim().length > 0;

const Card: FC<Props> = ({ cardIndex, showCardDetail, card }) => {
  const users = useAppSelector((state) => state.users.users);
  const assignee = card.assignedTo ? users.find((user) => user._id === card.assignedTo) : null;
  const showMeta = assignee || hasDescription(card.description);
  // New cards are saved with this stand-in title until someone names them
  const isUntitled = !card.title || card.title === 'Add title';

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
          aria-label={`Open card ${isUntitled ? 'Untitled card' : card.title}`}
          mb="8px"
          borderRadius="control"
          onClick={() => showCardDetail(card._id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') showCardDetail(card._id);
          }}>
          {/* The drag library owns the outer transform, so the tilt lives on this inner tile */}
          <Box
            px="12px"
            py="10px"
            bg="surface"
            border="1px solid"
            borderColor={snapshot.isDragging ? 'lineStrong' : 'line'}
            borderRadius="control"
            boxShadow={snapshot.isDragging ? 'lifted' : 'tile'}
            cursor={snapshot.isDragging ? 'grabbing' : 'pointer'}
            transform={snapshot.isDragging ? 'rotate(2deg)' : 'none'}
            transition="border-color 140ms, box-shadow 200ms, transform 200ms"
            _hover={{ borderColor: 'lineStrong', boxShadow: 'raised' }}>
            {card.label?.type && (
              <Box mb="6px" display="flex">
                <LabelChip type={card.label.type} bg={card.label.bg} />
              </Box>
            )}
            <Text
              fontSize="14px"
              lineHeight="1.4"
              fontWeight={500}
              color={isUntitled ? 'muted' : 'ink'}
              wordBreak="break-word">
              {isUntitled ? 'Untitled card' : card.title}
            </Text>
            {showMeta && (
              <Box display="flex" alignItems="center" justifyContent="space-between" mt="10px">
                {hasDescription(card.description) ? (
                  <Box color="muted" aria-label="Has a description" title="Has a description">
                    <FiAlignLeft size="14px" />
                  </Box>
                ) : (
                  <span />
                )}
                {assignee && (
                  <Tooltip label={`Assigned to ${assignee.fullName}`} openDelay={300}>
                    <Avatar size="xs" name={assignee.fullName} bg="night" color="white" />
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export default Card;
