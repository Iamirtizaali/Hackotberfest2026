import React, { useState } from 'react';
import { Avatar, Box, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { AiMark } from '@/src/components/brand/logo';
import { motion, palette } from '@/src/theme';

// The landing page's one orchestrated moment: phrases in a written brief are picked out in
// gold, and the cards they become settle into an assigned board. It plays once on load;
// after that, pointing at a card shows which part of the brief it came from.

type PhraseKey = 'cart' | 'pay' | 'track' | 'ci';

type DemoCard = {
  title: string;
  phrase?: PhraseKey;
  person: string;
  skill: string;
  hours: number;
  priority: 'high' | 'medium' | 'low';
};

const priorityColor = {
  high: palette.rose,
  medium: palette.saffron,
  low: palette.verdigris
};

const columns: { name: string; cards: DemoCard[] }[] = [
  {
    name: 'Design',
    cards: [
      {
        title: 'Cart and payment screens',
        phrase: 'cart',
        person: 'Sara Designer',
        skill: 'UI/UX',
        hours: 8,
        priority: 'high'
      }
    ]
  },
  {
    name: 'Build',
    cards: [
      {
        title: 'Card and wallet payments',
        phrase: 'pay',
        person: 'Ben Backend',
        skill: 'Payments',
        hours: 14,
        priority: 'high'
      },
      {
        title: 'Editable cart with live totals',
        phrase: 'cart',
        person: 'Fiona Frontend',
        skill: 'React',
        hours: 10,
        priority: 'medium'
      },
      {
        title: 'Order status page and API',
        phrase: 'track',
        person: 'Ben Backend',
        skill: 'Node.js',
        hours: 9,
        priority: 'medium'
      }
    ]
  },
  {
    name: 'Release',
    cards: [
      {
        title: 'CI pipeline for release builds',
        phrase: 'ci',
        person: 'Devon DevOps',
        skill: 'CI/CD',
        hours: 6,
        priority: 'medium'
      },
      {
        title: 'Launch checklist and QA pass',
        person: 'Paula Planner',
        skill: 'Project Management',
        hours: 4,
        priority: 'low'
      }
    ]
  }
];

// When each phrase is picked out (ms); its cards land just after
const phraseDelay: Record<PhraseKey, number> = { cart: 500, pay: 850, track: 1200, ci: 1550 };
const LAST_DELAY = 1900;

const sweep = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Phrase = ({
  id,
  active,
  onHover,
  children
}: {
  id: PhraseKey;
  active: PhraseKey | null;
  onHover: (key: PhraseKey | null) => void;
  children: React.ReactNode;
}) => (
  <Box
    as="mark"
    position="relative"
    bg={active === id ? 'goldWash' : 'transparent'}
    color="inherit"
    borderRadius="2px"
    px="1px"
    transition="background-color 160ms"
    onMouseEnter={() => onHover(id)}
    onMouseLeave={() => onHover(null)}
    sx={{
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '-2px',
        height: '2px',
        borderRadius: '1px',
        background: palette.gold,
        transformOrigin: 'left',
        animation: `${sweep} 420ms ${motion.easeCss} both`,
        animationDelay: `${phraseDelay[id]}ms`
      }
    }}>
    {children}
  </Box>
);

const BriefToBoard = (): JSX.Element => {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<PhraseKey | null>(null);

  let order = 0;

  return (
    <Box
      role="img"
      aria-label="Example: a short project brief for a mobile checkout becomes a board with Design, Build and Release columns. Each card shows the person it is assigned to, the skill it needs and an hour estimate."
      bg="surface"
      borderRadius="sheet"
      boxShadow="lifted"
      border="1px solid"
      borderColor="line"
      p={['10px', '12px']}
      display="grid"
      gridTemplateColumns={['1fr', '1fr', '1fr', 'minmax(0, 4fr) minmax(0, 9fr)']}
      gridGap={['10px', '12px']}>
      {/* The brief */}
      <Box
        aria-hidden="true"
        bg="marble"
        borderRadius="panel"
        p={['16px', '20px']}
        display="flex"
        flexDirection="column">
        <Text fontSize="12px" fontWeight={600} color="muted">
          Brief
        </Text>
        <Text
          mt="8px"
          fontSize="15px"
          fontWeight={650}
          letterSpacing="-0.01em"
          sx={{ fontStretch: '112%' }}>
          Mobile checkout
        </Text>
        <Text mt="10px" fontSize="14px" lineHeight="1.75" color="ink">
          Launch a mobile checkout in three weeks. Customers should be able to{' '}
          <Phrase id="cart" active={active} onHover={setActive}>
            review their cart
          </Phrase>
          ,{' '}
          <Phrase id="pay" active={active} onHover={setActive}>
            pay by card or wallet
          </Phrase>{' '}
          and{' '}
          <Phrase id="track" active={active} onHover={setActive}>
            track the order
          </Phrase>{' '}
          after buying. Release builds should{' '}
          <Phrase id="ci" active={active} onHover={setActive}>
            run through CI
          </Phrase>{' '}
          before launch.
        </Text>
        <Box flex="1" />
        <Box
          mt="18px"
          display="flex"
          alignItems="center"
          sx={{ gap: '8px' }}
          fontSize="12px"
          color="goldInk"
          fontWeight={600}>
          <AiMark size={13} />
          Drafted 6 cards for 5 people
        </Box>
      </Box>

      {/* The board it became */}
      <Box
        aria-hidden="true"
        bg="night"
        borderRadius="panel"
        p={['10px', '12px']}
        display="grid"
        gridTemplateColumns={['1fr', 'repeat(3, minmax(0, 1fr))']}
        gridGap={['10px', '10px']}
        alignItems="start">
        {columns.map((column) => (
          <Box key={column.name} bg="marble" borderRadius="control" p="8px">
            <Box display="flex" alignItems="center" sx={{ gap: '6px' }} px="4px" pb="8px">
              <Text fontSize="13px" fontWeight={650}>
                {column.name}
              </Text>
              <Text fontSize="12px" color="muted" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {column.cards.length}
              </Text>
            </Box>
            <Box display="flex" flexDirection="column" sx={{ gap: '6px' }}>
              {column.cards.map((card) => {
                const i = order++;
                const delay = (card.phrase ? phraseDelay[card.phrase] + 180 : LAST_DELAY) + i * 30;
                const isLinked = active && card.phrase === active;

                return (
                  <Motion.div
                    key={card.title}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -14, rotate: i % 2 ? 3 : -3, scale: 0.97 }
                    }
                    animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: motion.ease, delay: delay / 1000 }}
                    onMouseEnter={() => card.phrase && setActive(card.phrase)}
                    onMouseLeave={() => setActive(null)}>
                    <Box
                      bg="surface"
                      borderRadius="6px"
                      border="1px solid"
                      borderColor={isLinked ? 'gold.500' : 'line'}
                      boxShadow={isLinked ? '0 0 0 2px rgba(212, 161, 42, 0.35)' : 'tile'}
                      display="flex"
                      overflow="hidden"
                      transition="border-color 160ms, box-shadow 160ms">
                      <Box width="3px" flexShrink={0} bg={priorityColor[card.priority]} />
                      <Box flex="1" minWidth="0" px="10px" py="8px">
                        <Text fontSize="13px" fontWeight={560} lineHeight="1.35">
                          {card.title}
                        </Text>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{ gap: '6px' }}
                          mt="8px"
                          fontSize="11px"
                          color="muted">
                          <Avatar
                            size="2xs"
                            name={card.person}
                            bg="night"
                            color="white"
                            fontWeight={600}
                          />
                          <Text as="span" isTruncated flex="1" minWidth="0">
                            {card.skill}
                          </Text>
                          <Text as="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                            {card.hours}h
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Motion.div>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default BriefToBoard;
