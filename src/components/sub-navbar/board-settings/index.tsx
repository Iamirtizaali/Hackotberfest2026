import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  Box,
  Heading,
  Text,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useAppSelector } from '@/src/hooks';
import { useDispatch } from 'react-redux';
import { updateBoardDetail, saveBoard, fetchBoard, deleteBoard } from '@/src/slices/board';
import { FiSliders } from 'react-icons/fi';
import { useRouter } from 'next/router';

const BoardSettings = (): JSX.Element => {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();
  const [isConfirming, setIsConfirming] = useState(false);
  const board = useAppSelector((state) => state.board.board);
  const boardDetail = useAppSelector((state) => state.board);
  const boardDelete = useAppSelector((state) => state.board.isLoading);
  const dispatch = useDispatch();
  const router = useRouter();

  const onClose = () => {
    setIsConfirming(false);
    closeModal();
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();

    await dispatch(saveBoard());
    await dispatch(fetchBoard(board._id));

    onClose();
  };

  const handleDelete = async () => {
    await dispatch(deleteBoard());

    if (boardDetail.status === 'success') {
      router.push('/boards');
    }
  };

  return (
    <>
      <Tooltip label="Board settings">
        <IconButton
          aria-label="Board settings"
          icon={<FiSliders />}
          onClick={onOpen}
          variant="onNight"
          size="sm"
        />
      </Tooltip>
      <Modal onClose={onClose} isOpen={isOpen} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent mx="16px">
          <ModalHeader>Board settings</ModalHeader>
          <ModalCloseButton top="14px" />
          <ModalBody pb="24px">
            <form onSubmit={handleSave}>
              <FormControl id="board-name">
                <FormLabel>Board name</FormLabel>
                <Box display="flex" sx={{ gap: '8px' }}>
                  <Input
                    value={board.name}
                    onChange={(e) =>
                      dispatch(updateBoardDetail({ type: 'name', value: e.target.value }))
                    }
                  />
                  <Button
                    type="submit"
                    colorScheme="brand"
                    flexShrink={0}
                    isLoading={boardDetail.isLoading}
                    loadingText="Saving">
                    Save
                  </Button>
                </Box>
              </FormControl>
            </form>
            <Box
              mt="28px"
              p="16px"
              border="1px solid"
              borderColor="rgba(199, 64, 90, 0.35)"
              borderRadius="control"
              bg="rgba(199, 64, 90, 0.04)">
              <Heading as="h3" fontSize="15px" fontFamily="body" letterSpacing="0">
                Delete this board
              </Heading>
              <Text mt="4px" fontSize="14px" color="muted">
                This removes the board with all of its columns and cards, for everyone on it. It
                can&apos;t be undone.
              </Text>
              {isConfirming ? (
                <Box display="flex" flexWrap="wrap" sx={{ gap: '8px' }} mt="14px">
                  <Button
                    bg="danger"
                    color="white"
                    _hover={{ bg: '#AE3149' }}
                    _active={{ bg: '#952A3F' }}
                    onClick={handleDelete}
                    isLoading={boardDelete}
                    loadingText="Deleting">
                    Yes, delete board
                  </Button>
                  <Button variant="ghost" onClick={() => setIsConfirming(false)}>
                    Keep board
                  </Button>
                </Box>
              ) : (
                <Button
                  mt="14px"
                  variant="quiet"
                  color="danger"
                  onClick={() => setIsConfirming(true)}>
                  Delete board
                </Button>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BoardSettings;
