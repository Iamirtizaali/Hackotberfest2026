import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';

type MarkProps = {
  size?: number;
  // On dark or photographic backgrounds the ink tiles flip to white
  inverted?: boolean;
};

export const TesseraMark: FC<MarkProps> = ({ size = 24, inverted = false }) => {
  const tile = inverted ? '#FFFFFF' : '#1E2925';
  const accent = inverted ? '#AEB9EF' : '#2B44C7';

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="12" height="12" rx="2.5" fill={tile} />
      <rect x="17" y="3" width="12" height="12" rx="2.5" fill={tile} />
      <rect x="3" y="17" width="12" height="12" rx="2.5" fill={tile} />
      <rect
        x="17"
        y="17"
        width="12"
        height="12"
        rx="2.5"
        fill={accent}
        transform="rotate(12 23 23)"
      />
    </svg>
  );
};

type LogoProps = MarkProps & {
  fontSize?: string;
};

const TesseraLogo: FC<LogoProps> = ({ size = 24, inverted = false, fontSize = '20px' }) => {
  return (
    <Box display="inline-flex" alignItems="center" sx={{ gap: '8px' }}>
      <TesseraMark size={size} inverted={inverted} />
      <Text
        as="span"
        fontFamily="heading"
        fontWeight={600}
        fontSize={fontSize}
        letterSpacing="-0.03em"
        lineHeight="1"
        color={inverted ? 'white' : 'ink'}>
        Tessera
      </Text>
    </Box>
  );
};

export default TesseraLogo;
