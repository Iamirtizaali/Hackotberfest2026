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
  FormHelperText
} from '@chakra-ui/react';
import { FiUserPlus } from 'react-icons/fi';
import checkEnvironment from '@/util/check-environment';
import { useAppSelector } from '@/src/hooks';
import { onPhotoButton } from '@/src/components/sub-navbar/on-photo-button';

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
      <Button leftIcon={<FiUserPlus />} onClick={onOpen} {...onPhotoButton}>
        Invite
      </Button>
      <Modal onClose={onClose} isOpen={isOpen} initialFocusRef={inputRef} isCentered>
        <ModalOverlay />
        <ModalContent mx="16px">
          <form onSubmit={handleSubmit}>
            <ModalHeader>Invite to {board?.name || 'board'}</ModalHeader>
            <ModalCloseButton />
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
