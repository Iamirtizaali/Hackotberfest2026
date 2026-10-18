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
  <Text fontSize="13px" fontWeight={620} color="ink" mb="6px">
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
  const columns = useAppSelector((state) => state.columns.columns) as Array<{
    _id: string;
    columnName?: string;
  }>;
  const rawColumnName = columns.find((c) => c._id === card.columnId)?.columnName;
  const columnName = rawColumnName && rawColumnName !== 'Add title' ? rawColumnName : '';
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
          variant="quiet"
          fontWeight={400}
          textAlign="left"
          rightIcon={<FiChevronDown />}>
          {assignee ? (
            <Box as="span" display="inline-flex" alignItems="center" sx={{ gap: '8px' }}>
              <Avatar size="2xs" name={assignee.fullName} bg="night" color="white" />
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
              <Avatar size="2xs" name={user.fullName} bg="night" color="white" mr="8px" />
              {user?.fullName}
            </MenuItem>
          ))}
          <MenuDivider />
          <MenuItem onClick={() => handleClick('')}>Unassign</MenuItem>
        </MenuList>
      </Menu>
    );
  };

  return (
    <Modal size="xl" onClose={handleModalClose} isOpen={isOpen} isCentered scrollBehavior="inside">
      <ModalOverlay />
      {/* https://github.com/chakra-ui/chakra-ui/discussions/2676 */}
      <ModalContent maxW="800px" mx={['8px', '16px']} my={['8px', '16px']}>
        <ModalCloseButton aria-label="Save and close" top="16px" right="16px" />
        <Box px={['20px', '28px']} pt="22px" pb="16px" borderBottom="1px solid" borderColor="line">
          <Text fontSize="13px" color="muted" pr="48px">
            {columnName ? (
              <>
                In column <strong>{columnName}</strong>
              </>
            ) : (
              'Card'
            )}
          </Text>
          <Input
            name="title"
            aria-label="Card title"
            variant="unstyled"
            value={title === 'Add title' ? '' : title}
            fontFamily="heading"
            fontWeight={700}
            fontSize={['20px', '24px']}
            letterSpacing="-0.02em"
            mt="4px"
            pr="40px"
            sx={{ fontStretch: '112%' }}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this card"
          />
        </Box>
        <ModalBody px={['20px', '28px']} py="20px" className="tessera-scroll">
          <Box
            display="grid"
            gridTemplateColumns={['1fr', '1fr', 'minmax(0, 1fr) 216px']}
            gridGap={['20px', '20px', '28px']}>
            <Box minWidth="0" order={[2, 2, 1]}>
              <FieldLabel>Description</FieldLabel>
              <QuillEditor value={description} onChange={setDescription} />
            </Box>
            <Box
              order={[1, 1, 2]}
              display="grid"
              gridTemplateColumns={['1fr 1fr', '1fr 1fr', '1fr']}
              gridGap="16px"
              alignContent="start">
              <Box minWidth="0">
                <FieldLabel>Label</FieldLabel>
                <CardLabel id={card._id} boardId={card.boardId} value={label} onChange={setLabel} />
              </Box>
              <Box minWidth="0">
                <FieldLabel>Assignee</FieldLabel>
                {assignToMenu()}
              </Box>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter
          justifyContent="space-between"
          px={['20px', '28px']}
          py="14px"
          borderTop="1px solid"
          borderColor="line"
          bg="marble"
          borderBottomRadius="panel">
          <Button
            size="sm"
            variant="dangerQuiet"
            leftIcon={<FiTrash2 />}
            onClick={handleCardDelete}
            isDisabled={cardDelete}
            isLoading={cardDelete}
            loadingText="Deleting">
            Delete card
          </Button>
          <Button
            size="sm"
            colorScheme="brand"
            px="18px"
            onClick={handleModalClose}
            isDisabled={cardRequest}
            isLoading={cardRequest}
            loadingText="Saving">
            Save and close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CardDetailsModal;
