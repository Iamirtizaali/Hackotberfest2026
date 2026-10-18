import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';

type MarkProps = {
  size?: number;
  // On the dark lapis ground the ink tiles flip to white
  inverted?: boolean;
};

export const TesseraMark: FC<MarkProps> = ({ size = 24, inverted = false }) => {
  const tile = inverted ? '#FFFFFF' : '#171C2E';
  const accent = inverted ? '#D4A12A' : '#2B44C7';

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

// The planner's mark: a single gold tile set slightly off the grid
export const AiMark: FC<{ size?: number; color?: string }> = ({ size = 14, color = '#D4A12A' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="6.5" width="5" height="5" rx="1" fill="currentColor" opacity="0.45" />
    <rect
      x="6.5"
      y="1.5"
      width="8"
      height="8"
      rx="1.5"
      fill={color}
      transform="rotate(12 10.5 5.5)"
    />
    <rect x="7.5" y="10.5" width="4" height="4" rx="0.8" fill="currentColor" opacity="0.7" />
  </svg>
);

type LogoProps = MarkProps & {
  fontSize?: string;
};

const TesseraLogo: FC<LogoProps> = ({ size = 24, inverted = false, fontSize = '20px' }) => {
  return (
    <Box display="inline-flex" alignItems="center" sx={{ gap: '9px' }}>
      <TesseraMark size={size} inverted={inverted} />
      <Text
        as="span"
        fontFamily="heading"
        fontWeight={720}
        fontSize={fontSize}
        letterSpacing="-0.03em"
        lineHeight="1"
        color={inverted ? 'white' : 'ink'}
        sx={{ fontStretch: '118%' }}>
        Tessera
      </Text>
    </Box>
  );
};

export default TesseraLogo;
