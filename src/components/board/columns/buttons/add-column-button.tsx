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
    <Box width="288px" flexShrink={0} pr="20px">
      <Button
        width="100%"
        height="46px"
        justifyContent="flex-start"
        leftIcon={<FiPlus />}
        fontSize="14px"
        borderRadius="panel"
        bg="rgba(20, 27, 77, 0.45)"
        color="white"
        border="1.5px dashed rgba(255, 255, 255, 0.45)"
        _hover={{ bg: 'rgba(20, 27, 77, 0.62)', borderColor: 'rgba(255, 255, 255, 0.7)' }}
        _active={{ bg: 'rgba(20, 27, 77, 0.72)' }}
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
