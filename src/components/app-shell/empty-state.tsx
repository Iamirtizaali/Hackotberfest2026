import React, { FC, ReactNode } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description: string;
  action?: ReactNode;
};

// Three loose tiles stand in for an illustration
const EmptyState: FC<Props> = ({ title, description, action }) => {
  return (
    <Box
      border="1px dashed"
      borderColor="lineStrong"
      borderRadius="panel"
      px={['20px', '40px']}
      py={['40px', '56px']}
      textAlign="center">
      <Box display="flex" justifyContent="center" sx={{ gap: '6px' }} mb="20px" aria-hidden="true">
        <Box width="18px" height="18px" borderRadius="4px" bg="line" />
        <Box width="18px" height="18px" borderRadius="4px" bg="line" />
        <Box width="18px" height="18px" borderRadius="4px" bg="lapis" transform="rotate(12deg)" />
      </Box>
      <Heading as="h2" fontSize="18px" letterSpacing="-0.02em">
        {title}
      </Heading>
      <Text mt="6px" color="muted" fontSize="14px" maxW="44ch" mx="auto">
        {description}
      </Text>
      {action && <Box mt="20px">{action}</Box>}
    </Box>
  );
};

export default EmptyState;
