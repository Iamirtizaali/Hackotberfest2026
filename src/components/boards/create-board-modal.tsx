import React, { FC, useRef } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
};

const CreateBoardModal: FC<Props> = ({ label = 'New board' }) => {
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

  return (
    <>
      <Button onClick={onOpen} leftIcon={<FiPlus />} colorScheme="brand" size="md" fontSize="14px">
        {label}
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} initialFocusRef={inputRef} isCentered>
        <ModalOverlay />
        <ModalContent mx="16px">
          <form onSubmit={handleCreate}>
            <ModalHeader>New board</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl id="board-name">
                <FormLabel>Board name</FormLabel>
                <Input
                  value={board.name}
                  onChange={handleChange}
                  placeholder="e.g. Website relaunch"
                  ref={inputRef}
                />
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
