import React, { FC } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useAppSelector } from '@/src/hooks';
import { AiPlannerButton } from '@/src/components/ai-planner';

type Props = {
  addColumn: () => void;
};

// A new board offers both ways in: build it by hand, or let the planner draft it
const EmptyBoard: FC<Props> = ({ addColumn }) => {
  const columnRequest = useAppSelector((state) => state.columns.isRequesting);

  return (
    <Box
      width={['calc(100vw - 24px)', '420px']}
      maxW="420px"
      bg="surface"
      borderRadius="panel"
      boxShadow="lifted"
      p={['20px', '24px']}>
      <Text as="h2" textStyle="sectionTitle" fontSize="18px">
        This board is empty
      </Text>
      <Text mt="6px" fontSize="14px" color="muted" lineHeight="1.6">
        Add columns for each stage of your work, such as To do, Doing and Done. Or describe the
        project and the AI planner will draft the columns and cards for you to review.
      </Text>
      <Box display="flex" flexWrap="wrap" sx={{ gap: '8px' }} mt="18px">
        <AiPlannerButton size="md" fontSize="14px" />
        <Button
          variant="quiet"
          fontSize="14px"
          leftIcon={<FiPlus />}
          onClick={addColumn}
          isLoading={columnRequest}
          loadingText="Adding column">
          Add a column
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyBoard;
