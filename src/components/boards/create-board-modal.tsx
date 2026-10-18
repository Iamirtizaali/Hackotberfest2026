import React, { FC, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import shortId from 'shortid';
import { useAppSelector } from '@/src/hooks';
import { updateBoardDetail, resetBoard } from '@/src/slices/board';
import { createBoard, fetchBoards } from '@/src/slices/boards';

type Props = {
  label?: string;
  // "tile" renders an empty board slot for the boards grid
  variant?: 'button' | 'quiet' | 'tile';
};

const CreateBoardModal: FC<Props> = ({ label = 'New board', variant = 'button' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const board = useAppSelector((state) => state.board.board);
  const boardRequest = useAppSelector((state) => state.boards.isRequesting);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!board.name?.trim()) return;

    const id = shortId.generate();
    const date = new Date().toISOString();

    dispatch(updateBoardDetail({ type: '_id', value: id }));
    dispatch(updateBoardDetail({ type: 'dateCreated', value: date }));

    await dispatch(createBoard());
    await dispatch(fetchBoards());
    await dispatch(resetBoard());

    onClose();
  };

  const handleChange = (e) => {
    dispatch(updateBoardDetail({ type: 'name', value: e.target.value }));
  };

  const trigger =
    variant === 'tile' ? (
      <Box
        as="button"
        type="button"
        onClick={onOpen}
        display="block"
        width="100%"
        textAlign="left"
        role="group"
        borderRadius="panel">
        <Box
          position="relative"
          paddingTop="58%"
          borderRadius="panel"
          border="1.5px dashed"
          borderColor="lineStrong"
          bg="marble"
          transition="border-color 140ms, background-color 140ms"
          _groupHover={{ borderColor: 'lapis', bg: 'brand.50' }}>
          <Box
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="muted"
            _groupHover={{ color: 'lapis' }}>
            <FiPlus size="22px" aria-hidden="true" />
          </Box>
        </Box>
        <Box pt="10px" px="2px">
          <Text fontWeight={620} fontSize="15px">
            {label}
          </Text>
          <Text fontSize="13px" color="muted" mt="1px">
            Name it now, add columns next
          </Text>
        </Box>
      </Box>
    ) : (
      <Button
        onClick={onOpen}
        leftIcon={<FiPlus />}
        colorScheme={variant === 'button' ? 'brand' : undefined}
        variant={variant === 'quiet' ? 'quiet' : 'solid'}
        size="md"
        fontSize="14px">
        {label}
      </Button>
    );

  return (
    <>
      {trigger}
      <Modal onClose={onClose} isOpen={isOpen} initialFocusRef={inputRef} isCentered>
        <ModalOverlay />
        <ModalContent mx="16px">
          <form onSubmit={handleCreate}>
            <ModalHeader>New board</ModalHeader>
            <ModalCloseButton top="14px" />
            <ModalBody>
              <FormControl id="board-name">
                <FormLabel>Board name</FormLabel>
                <Input
                  value={board.name}
                  onChange={handleChange}
                  placeholder="e.g. Website relaunch"
                  ref={inputRef}
                  autoComplete="off"
                />
                <FormHelperText color="muted">
                  One board per project works best. You can rename it later.
                </FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter sx={{ gap: '8px' }}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                isDisabled={!board.name?.trim()}
                isLoading={boardRequest}
                loadingText="Creating">
                Create board
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateBoardModal;
