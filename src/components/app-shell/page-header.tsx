import React, { FC, ReactNode } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  description?: string;
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
      mb={['24px', '32px']}>
      <Box>
        <Heading as="h1" fontSize={['28px', '32px']} letterSpacing="-0.035em" lineHeight="1.1">
          {title}
        </Heading>
        {description && (
          <Text mt="6px" color="muted" fontSize="15px">
            {description}
          </Text>
        )}
      </Box>
      {actions}
    </Box>
  );
};

export default PageHeader;
