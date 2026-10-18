import {
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { saveBoard } from '@/src/slices/board';

import React from 'react';
import { FiImage } from 'react-icons/fi';
import Unsplash from '@/src/components/sub-navbar/unsplash-in-drawer/unsplash';
import { useAppSelector } from '@/src/hooks';

const UnsplashDrawer = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const board = useAppSelector((state) => state.board);

  const dispatch = useDispatch();

  const btnRef = React.useRef();

  const handleSave = async () => {
    await dispatch(saveBoard());
    onClose();
  };

  return (
    <>
      <Tooltip label="Change background">
        <IconButton
          aria-label="Change background"
          icon={<FiImage />}
          ref={btnRef}
          onClick={onOpen}
          variant="onNight"
          size="sm"
        />
      </Tooltip>
      <Drawer size="sm" isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton top="14px" />
          <DrawerHeader borderBottom="1px solid" borderColor="line">
            Background
            <Text fontSize="14px" fontWeight={400} color="muted" mt="4px" letterSpacing="0">
              Pick a photo from Unsplash. Everyone on the board sees it.
            </Text>
          </DrawerHeader>
          <DrawerBody py="20px">
            <Unsplash />
          </DrawerBody>
          <DrawerFooter borderTop="1px solid" borderColor="line" sx={{ gap: '8px' }}>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={handleSave}
              loadingText="Saving"
              isLoading={board.isLoading}>
              Save background
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UnsplashDrawer;
