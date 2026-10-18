import React, { FC } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useAppSelector } from '@/src/hooks';

type Props = {
  addColumn: () => void;
};

const AddColumnButton: FC<Props> = ({ addColumn }) => {
  const columnRequest = useAppSelector((state) => state.columns.isRequesting);

  return (
    <Box width="280px" flexShrink={0} pr="16px">
      <Button
        width="100%"
        height="44px"
        justifyContent="flex-start"
        leftIcon={<FiPlus />}
        fontSize="14px"
        borderRadius="panel"
        bg="rgba(255, 255, 255, 0.18)"
        color="white"
        _hover={{ bg: 'rgba(255, 255, 255, 0.28)' }}
        _active={{ bg: 'rgba(255, 255, 255, 0.34)' }}
        sx={{ backdropFilter: 'blur(8px)' }}
        onClick={addColumn}
        isLoading={columnRequest}
        isDisabled={columnRequest}
        loadingText="Adding column">
        Add a column
      </Button>
    </Box>
  );
};

AddColumnButton.propTypes = {
  addColumn: PropTypes.func
};

export default AddColumnButton;
