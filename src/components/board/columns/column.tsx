import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  MenuItem,
  MenuDivider,
  Text
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiMoreHorizontal, FiPlus } from 'react-icons/fi';
import Cards from '@/src/components/board/columns/cards';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';

import { deleteColumn, fetchColumns, updateColumn } from '@/src/slices/columns';
import { addCard, fetchCards } from '@/src/slices/cards';
import debounce from 'lodash.debounce';
import { CardDetail } from '@/src/types/cards';

const Column = ({ showCardDetail, column, index, id, cards }): JSX.Element => {
  const dispatch = useDispatch();
  const [showEditBox, setEditBoxVisibility] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showEditBox) titleInputRef.current?.focus();
  }, [showEditBox]);
  // Tracked per column so only the column being added to shows a spinner
  const [isAddingCard, setIsAddingCard] = useState(false);

  const [columnName, setColumnName] = useState<string>(column.columnName);
  const cardsInSortedSequence = cards.sort(
    (cardA: CardDetail, cardB: CardDetail) => cardA.sequence - cardB.sequence
  );

  const isUntitled = !columnName || columnName === 'Add title';

  const loadColumnTitle = (draggableProps) => {
    if (showEditBox) {
      return (
        <Input
          bg="surface"
          value={columnName === 'Add title' ? '' : columnName}
          placeholder="Column name"
          size="sm"
          borderRadius="control"
          fontWeight={620}
          aria-label="Column name"
          ref={titleInputRef}
          onChange={handleChange}
          onBlur={() => setEditBoxVisibility(false)}
          onKeyDown={handleKeyDown}
        />
      );
    }

    return (
      <Box
        {...draggableProps}
        flex="1"
        minWidth="0"
        display="flex"
        alignItems="center"
        sx={{ gap: '8px' }}
        px="4px"
        minHeight="32px"
        cursor="grab"
        onDoubleClick={() => setEditBoxVisibility(true)}>
        <Heading
          as="h2"
          fontSize="14px"
          fontWeight={650}
          fontFamily="body"
          letterSpacing="-0.005em"
          color={isUntitled ? 'muted' : 'ink'}
          isTruncated>
          {isUntitled ? 'Untitled column' : columnName}
        </Heading>
        <Text
          as="span"
          fontSize="12px"
          fontWeight={600}
          color="muted"
          bg="rgba(23, 28, 46, 0.06)"
          borderRadius="tile"
          px="6px"
          lineHeight="18px"
          flexShrink={0}
          sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {cards.length}
        </Text>
      </Box>
    );
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setEditBoxVisibility(false);
    }
  };

  const handleCardAdd = async () => {
    setIsAddingCard(true);
    await dispatch(addCard(column._id));
    await dispatch(fetchCards());
    setIsAddingCard(false);
  };

  const handleChange = (e) => {
    setColumnName(e.target.value);
    handleColumnNameChange(e.target.value);
  };

  const handleColumnDelete = async () => {
    await dispatch(deleteColumn(id));
    await dispatch(fetchColumns());
  };

  const handleColumnNameChange = useCallback(
    debounce((value) => nameChange(value), 800),
    []
  );

  const nameChange = async (value) => {
    const data = {
      columnName: value,
      columnId: column._id
    };

    await dispatch(updateColumn(data));
  };

  return (
    <Draggable draggableId={column._id} index={index} key={column._id}>
      {(provided, snapshot) => (
        <Box
          key={index}
          width="288px"
          flexShrink={0}
          maxHeight="100%"
          mr="12px"
          display="flex"
          flexDirection="column"
          bg="marble"
          borderRadius="panel"
          boxShadow={snapshot.isDragging ? 'lifted' : '0 1px 2px rgba(20, 27, 77, 0.18)'}
          transition="box-shadow 200ms"
          {...provided.draggableProps}
          ref={provided.innerRef}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ gap: '4px' }}
            pl="10px"
            pr="6px"
            pt="8px"
            pb="4px">
            {loadColumnTitle(provided.dragHandleProps)}
            <Menu placement="bottom-end">
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={IconButton}
                    aria-label={`Options for ${columnName || 'column'}`}
                    icon={<FiMoreHorizontal />}
                    size="sm"
                    variant="ghost"
                    color="muted"
                  />
                  {/* Mounted only while open: a closed, hidden list would still widen the page */}
                  {isOpen && (
                    <Portal>
                      <MenuList>
                        <MenuItem icon={<FiEdit2 />} onClick={() => setEditBoxVisibility(true)}>
                          Rename column
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<FiTrash2 />} color="danger" onClick={handleColumnDelete}>
                          Delete column
                        </MenuItem>
                      </MenuList>
                    </Portal>
                  )}
                </>
              )}
            </Menu>
          </Box>
          <Droppable droppableId={column._id} type="card">
            {(provided) => (
              // A minimum height keeps empty columns droppable
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="tessera-scroll"
                minHeight="8px"
                overflowY="auto"
                px="8px"
                pt="2px">
                <Cards showCardDetail={showCardDetail} cards={cardsInSortedSequence} />
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
          <Box px="8px" pb="8px" pt="0">
            <Button
              size="sm"
              width="100%"
              justifyContent="flex-start"
              leftIcon={<FiPlus />}
              variant="ghost"
              color="muted"
              fontSize="13px"
              _hover={{ bg: 'rgba(23, 28, 46, 0.06)', color: 'ink' }}
              isDisabled={isAddingCard}
              isLoading={isAddingCard}
              loadingText="Adding card"
              onClick={handleCardAdd}>
              Add a card
            </Button>
          </Box>
        </Box>
      )}
    </Draggable>
  );
};

export default Column;
