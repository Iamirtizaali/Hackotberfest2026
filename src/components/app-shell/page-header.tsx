import React, { FC, ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
};

const PageHeader: FC<Props> = ({ title, description, actions }) => {
  return (
    <Box
      display="flex"
      flexDirection={['column', 'row']}
      alignItems={['flex-start', 'flex-end']}
      justifyContent="space-between"
      sx={{ gap: '16px' }}
      pb={['20px', '24px']}
      mb={['24px', '32px']}
      borderBottom="1px solid"
      borderColor="line">
      <Box minWidth="0">
        <Text as="h1" textStyle="pageTitle">
          {title}
        </Text>
        {description && (
          <Text mt="8px" color="muted" fontSize="15px" maxW="60ch">
            {description}
          </Text>
        )}
      </Box>
      {actions && (
        <Box display="flex" flexWrap="wrap" sx={{ gap: '8px' }} flexShrink={0}>
          {actions}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
