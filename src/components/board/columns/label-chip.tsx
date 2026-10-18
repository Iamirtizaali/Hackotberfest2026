import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';

type Props = {
  type: string;
  // Explicit colour (e.g. AI priority labels); falls back to the theme token named after the type
  bg?: string;
};

// A label is a small coloured tile plus its name, so colour is never the only signal
const LabelChip: FC<Props> = ({ type, bg }) => {
  return (
    <Box display="inline-flex" alignItems="center" sx={{ gap: '6px' }} minWidth="0">
      <Box width="9px" height="9px" borderRadius="2px" bg={bg || type} flexShrink={0} />
      <Text as="span" fontSize="12px" fontWeight={560} color="muted" isTruncated>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Text>
    </Box>
  );
};

export default LabelChip;
