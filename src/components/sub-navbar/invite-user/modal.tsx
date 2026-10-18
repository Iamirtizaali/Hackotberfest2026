import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  IconButton,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { FiUserPlus } from 'react-icons/fi';
import checkEnvironment from '@/util/check-environment';
import { useAppSelector } from '@/src/hooks';

const host = checkEnvironment();

const InviteModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [isMailSending, setMailSending] = useState(false);
  const board = useAppSelector((state) => state.board.board);

  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
  const showEmailError = !!email && !validEmail.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validEmail.test(email)) return;

    setMailSending(true);
    await sendEmail();
    setMailSending(false);
  };

  const sendEmail = async () => {
    const url = `${host}/api/mail`;

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ email, boardId: board._id })
    });

    const inJSON = await response.json();

    if (inJSON.status === 200) {
      onClose();
      setEmail('');
    }
  };

  return (
    <>
      <Button
        leftIcon={<FiUserPlus />}
        onClick={onOpen}
        variant="onNight"
        size="sm"
        fontSize="13px"
        display={['none', 'none', 'inline-flex']}>
        Invite
      </Button>
      <Tooltip label="Invite to board">
        <IconButton
          aria-label="Invite to board"
          icon={<FiUserPlus />}
          onClick={onOpen}
          variant="onNight"
          size="sm"
          display={['inline-flex', 'inline-flex', 'none']}
        />
      </Tooltip>
      <Modal onClose={onClose} isOpen={isOpen} initialFocusRef={inputRef} isCentered>
        <ModalOverlay />
        <ModalContent mx="16px">
          <form onSubmit={handleSubmit}>
            <ModalHeader pr="56px">
              Invite to {board?.name || 'board'}
              <Text fontSize="14px" fontWeight={400} color="muted" mt="4px" letterSpacing="0">
                Invited people can open the board, move cards and be assigned work.
              </Text>
            </ModalHeader>
            <ModalCloseButton top="14px" />
            <ModalBody>
              <FormControl id="invite-email" isInvalid={showEmailError}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  ref={inputRef}
                />
                {showEmailError ? (
                  <FormErrorMessage>Enter an email address like name@company.com.</FormErrorMessage>
                ) : (
                  <FormHelperText color="muted">
                    They&apos;ll get an email with a link to join this board.
                  </FormHelperText>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter sx={{ gap: '8px' }}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                isDisabled={!validEmail.test(email)}
                isLoading={isMailSending}
                loadingText="Sending">
                Send invite
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default InviteModal;
