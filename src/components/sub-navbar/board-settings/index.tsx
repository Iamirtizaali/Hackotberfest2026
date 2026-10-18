import React from 'react';
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
import { onPhotoButton } from '@/src/components/sub-navbar/on-photo-button';

const BoardSettings = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const board = useAppSelector((state) => state.board.board);
  const boardDetail = useAppSelector((state) => state.board);
  const boardDelete = useAppSelector((state) => state.board.isLoading);
  const dispatch = useDispatch();
  const router = useRouter();

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
          {...onPhotoButton}
        />
      </Tooltip>
      <Modal onClose={onClose} isOpen={isOpen} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent mx="16px">
          <ModalHeader>Board settings</ModalHeader>
          <ModalCloseButton />
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
            <Box mt="28px" pt="20px" borderTop="1px solid" borderColor="line">
              <Heading as="h3" fontSize="15px">
                Delete board
              </Heading>
              <Text mt="4px" fontSize="14px" color="muted">
                This removes the board with all of its columns and cards, for everyone on it.
              </Text>
              <Button
                mt="14px"
                variant="outline"
                color="danger"
                borderColor="danger"
                _hover={{ bg: 'rgba(199, 64, 90, 0.08)' }}
                onClick={handleDelete}
                isLoading={boardDelete}
                loadingText="Deleting">
                Delete board
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BoardSettings;
