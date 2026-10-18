import React, { FC, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  ModalOverlay,
  Text,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  Avatar
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { CardDetail, Label } from '@/src/types/cards';
import { deleteCard, fetchCards, updateCard } from '@/src/slices/cards';
import { useAppSelector } from '@/src/hooks';
import { FiTrash2, FiChevronDown } from 'react-icons/fi';
import CardLabel from '@/src/components/board/columns/modals/card-labels-menu';
import QuillEditor from '@/src/components/quill-editor';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  card: CardDetail;
};

const FieldLabel: FC = ({ children }) => (
  <Text fontSize="12px" fontWeight={500} color="muted" mb="6px">
    {children}
  </Text>
);

const CardDetailsModal: FC<Props> = ({ onClose, isOpen, card }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(card?.title);
  const [description, setDescription] = useState(card?.description);
  const [assigned, assignUser] = useState(card?.assignedTo);
  const [label, setLabel] = useState<Label | null>(card?.label || null);

  const cardRequest = useAppSelector((state) => state.cards.isRequesting);
  const cardDelete = useAppSelector((state) => state.cards.isDeleting);
  const users = useAppSelector((state) => state.users.users);
  const assignee = users.find((user) => user._id === assigned);

  const handleCardDelete = async () => {
    await dispatch(deleteCard(card._id));
    await dispatch(fetchCards());

    onClose();
  };

  const handleModalClose = async () => {
    const data = {
      _id: card._id,
      title,
      description,
      columnId: card.columnId,
      assignedTo: assigned
    };

    await dispatch(updateCard(data));
    await dispatch(fetchCards());

    onClose();
  };

  const handleClick = async (userId) => {
    assignUser(userId);

    const data = {
      _id: card._id,
      title,
      description,
      columnId: card.columnId,
      assignedTo: userId
    };

    await dispatch(updateCard(data));
  };

  const assignToMenu = () => {
    return (
      <Menu matchWidth>
        <MenuButton
          as={Button}
          size="sm"
          width="100%"
          variant="outline"
          borderColor="line"
          bg="surface"
          fontWeight={400}
          textAlign="left"
          rightIcon={<FiChevronDown />}>
          {assignee ? (
            <Box as="span" display="inline-flex" alignItems="center" sx={{ gap: '8px' }}>
              <Avatar size="2xs" name={assignee.fullName} bg="ink" color="white" />
              <Box as="span" isTruncated>
                {assignee.fullName}
              </Box>
            </Box>
          ) : (
            <Box as="span" color="muted">
              Nobody
            </Box>
          )}
        </MenuButton>
        <MenuList>
          {users.map((user) => (
            <MenuItem key={user._id} onClick={() => handleClick(user._id)}>
              <Avatar size="2xs" name={user.fullName} bg="ink" color="white" mr="8px" />
              {user?.fullName}
            </MenuItem>
          ))}
          <MenuDivider borderColor="line" />
          <MenuItem onClick={() => handleClick('')}>Unassign</MenuItem>
        </MenuList>
      </Menu>
    );
  };

  return (
    <Modal size="xl" onClose={handleModalClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
      <ModalContent maxW="760px" mx="16px">
        <ModalCloseButton aria-label="Save and close" top="14px" right="14px" />
        <ModalBody pt="24px" px={['20px', '28px']} pb="8px">
          <Input
            name="title"
            aria-label="Card title"
            variant="unstyled"
            value={title}
            fontFamily="heading"
            fontWeight={600}
            fontSize="22px"
            letterSpacing="-0.02em"
            pr="40px"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
          />
          <Box
            display="grid"
            gridTemplateColumns={['1fr', '1fr', '1fr 200px']}
            gridGap={['20px', '20px', '28px']}
            mt="20px">
            <Box minWidth="0" order={[2, 2, 1]}>
              <FieldLabel>Description</FieldLabel>
              <QuillEditor value={description} onChange={setDescription} />
            </Box>
            <Box order={[1, 1, 2]} display="flex" flexDirection="column" sx={{ gap: '16px' }}>
              <Box>
                <FieldLabel>Label</FieldLabel>
                <CardLabel id={card._id} boardId={card.boardId} value={label} onChange={setLabel} />
              </Box>
              <Box>
                <FieldLabel>Assignee</FieldLabel>
                {assignToMenu()}
              </Box>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="space-between" px={['20px', '28px']} pb="20px" pt="20px">
          <Button
            size="sm"
            variant="ghost"
            color="danger"
            leftIcon={<FiTrash2 />}
            _hover={{ bg: 'rgba(199, 64, 90, 0.08)' }}
            onClick={handleCardDelete}
            isDisabled={cardDelete}
            isLoading={cardDelete}
            loadingText="Deleting">
            Delete card
          </Button>
          <Button
            size="sm"
            colorScheme="brand"
            onClick={handleModalClose}
            isDisabled={cardRequest}
            isLoading={cardRequest}
            loadingText="Saving">
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CardDetailsModal;
