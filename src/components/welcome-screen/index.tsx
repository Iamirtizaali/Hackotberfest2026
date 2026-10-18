import React, { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Avatar, Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import {
  FiAlignLeft,
  FiCheck,
  FiChevronDown,
  FiFileText,
  FiImage,
  FiMove,
  FiTag,
  FiUserCheck,
  FiUserPlus
} from 'react-icons/fi';
import NavBar from '@/src/components/navbar';
import BriefToBoard from '@/src/components/welcome-screen/brief-to-board';
import TesseraLogo, { AiMark } from '@/src/components/brand/logo';
import { palette } from '@/src/theme';

const Container: FC<{ children: ReactNode }> = ({ children }) => (
  <Box maxW="1200px" mx="auto" px={['16px', '24px', '40px']}>
    {children}
  </Box>
);

// Small, real pieces of the interface that illustrate each step
const Fragment: FC<{ children: ReactNode }> = ({ children }) => (
  <Box
    bg="surface"
    border="1px solid"
    borderColor="line"
    borderRadius="panel"
    boxShadow="raised"
    p="14px"
    fontSize="14px"
    aria-hidden="true">
    {children}
  </Box>
);

const ComposerFragment = () => (
  <Fragment>
    <Box
      display="inline-flex"
      alignItems="center"
      sx={{ gap: '6px' }}
      bg="marble"
      border="1px solid"
      borderColor="line"
      borderRadius="control"
      px="8px"
      py="4px"
      fontSize="13px">
      <FiFileText color={palette.muted} />
      checkout-spec.pdf
    </Box>
    <Text mt="10px" lineHeight="1.55">
      Plan the checkout from this spec. Three weeks, and Sara is only free in week one.
    </Text>
    <Flex justifyContent="flex-end" mt="12px">
      <Box
        bg="lapis"
        color="white"
        fontSize="13px"
        fontWeight={600}
        borderRadius="control"
        px="12px"
        py="6px">
        Draft plan
      </Box>
    </Flex>
  </Fragment>
);

const ReviewFragment = () => (
  <Fragment>
    <Box border="1px solid" borderColor="lineStrong" borderRadius="control" overflow="hidden">
      <Flex alignItems="stretch">
        <Box width="4px" bg={palette.rose} />
        <Box flex="1" px="12px" py="10px">
          <Flex justifyContent="space-between" alignItems="flex-start" sx={{ gap: '8px' }}>
            <Text fontWeight={600} lineHeight="1.35">
              Card and wallet payments
            </Text>
            <Box color="muted" transform="rotate(180deg)" mt="2px">
              <FiChevronDown />
            </Box>
          </Flex>
          <Flex mt="6px" fontSize="12px" color="muted" sx={{ gap: '10px' }} alignItems="center">
            <span>feature</span>
            <span>high priority</span>
            <span>14h</span>
            <Flex ml="auto" alignItems="center" sx={{ gap: '6px' }} color="ink">
              <Avatar size="2xs" name="Ben Backend" bg="night" color="white" />
              Ben Backend
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Box px="16px" py="10px" borderTop="1px solid" borderColor="line" fontSize="13px">
        <Text fontWeight={650} fontSize="12px">
          Why this assignee
        </Text>
        <Text color="muted" mt="2px" lineHeight="1.5">
          Ben lists Payments and Node.js in his profile, and the payment API blocks two other cards.
        </Text>
      </Box>
    </Box>
  </Fragment>
);

const CreateFragment = () => (
  <Fragment>
    <Flex justifyContent="space-between" alignItems="center" sx={{ gap: '10px' }}>
      <Text color="muted" fontSize="13px">
        Draft plan: 6 tasks, 51h
      </Text>
      <Box
        bg="lapis"
        color="white"
        fontSize="13px"
        fontWeight={600}
        borderRadius="control"
        px="12px"
        py="6px">
        Create on board
      </Box>
    </Flex>
    <Flex
      mt="12px"
      alignItems="center"
      sx={{ gap: '10px' }}
      bg="success"
      color="white"
      borderRadius="control"
      px="12px"
      py="10px"
      fontSize="13px"
      fontWeight={600}>
      <FiCheck />
      Created 6 cards in 3 columns
    </Flex>
  </Fragment>
);

const steps = [
  {
    title: 'Describe the project',
    body:
      'Write a few sentences about the goal, scope and deadline, or attach what you already have: a PDF, Word or PowerPoint file, a spreadsheet, or a photo of a whiteboard.',
    fragment: <ComposerFragment />
  },
  {
    title: 'Review the draft',
    body:
      'Every card arrives with an estimate, a priority, the skills it needs and the reason it went to that person. Ask for changes in plain words, or regenerate.',
    fragment: <ReviewFragment />
  },
  {
    title: 'Create it on the board',
    body:
      'Nothing is added until you choose Create on board. From then on it is an ordinary board your team can move, edit and reassign.',
    fragment: <CreateFragment />
  }
];

const boardFeatures = [
  {
    icon: FiMove,
    title: 'Drag cards and columns',
    body: 'Reorder work across stages as it moves.'
  },
  {
    icon: FiTag,
    title: 'Labels and priorities',
    body: 'Mark bugs, features and priority at a glance.'
  },
  {
    icon: FiUserCheck,
    title: 'One owner per card',
    body: 'Reassign anything the planner suggested.'
  },
  {
    icon: FiAlignLeft,
    title: 'Rich descriptions',
    body: 'Headings, lists, links and images on any card.'
  },
  {
    icon: FiUserPlus,
    title: 'Invite by email',
    body: 'Teammates join the board from a link.'
  },
  {
    icon: FiImage,
    title: 'Board backgrounds',
    body: 'Give each project its own photo from Unsplash.'
  }
];

const WelcomeScreen = (): JSX.Element => {
  return (
    <Box minHeight="100vh" bg="marble" display="flex" flexDirection="column">
      {/* Hero: the lapis ground, with the example board straddling its lower edge */}
      <Box bg="night" color="white" position="relative" pb={['200px', '220px', '260px']}>
        <NavBar inverted />
        <Container>
          <Box pt={['36px', '56px', '72px']} maxW="980px">
            <Text as="h1" textStyle="displayXl" color="white" maxW="15ch">
              Describe the project. Tessera drafts the board.
            </Text>
            <Box
              mt={['22px', '28px']}
              display="grid"
              gridTemplateColumns={['1fr', '1fr', 'minmax(0, 1fr) auto']}
              gridGap={['24px', '28px']}
              alignItems="end">
              <Text textStyle="lead" color="whiteAlpha.800" maxW="54ch">
                Write a brief or drop in a spec. The planner breaks it into columns and task cards,
                estimates each one and assigns it to the teammate whose skills fit. You review the
                draft before anything lands on the board.
              </Text>
              <Flex sx={{ gap: '10px' }} flexWrap="wrap">
                <Link href="/signup" passHref>
                  <Button
                    as="a"
                    size="lg"
                    fontSize="16px"
                    px="24px"
                    bg="gold.500"
                    color="night"
                    _hover={{ bg: 'gold.400' }}
                    _active={{ bg: 'gold.600' }}>
                    Create an account
                  </Button>
                </Link>
                <Link href="/login" passHref>
                  <Button as="a" size="lg" fontSize="16px" variant="onNight">
                    Log in
                  </Button>
                </Link>
              </Flex>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container>
        <Box mt={['-176px', '-196px', '-228px']} position="relative">
          <BriefToBoard />
          <Text mt="14px" fontSize="13px" color="muted" textAlign={['left', 'right']}>
            An example plan. Assignments come from the role and skills each member adds in Settings.
          </Text>
        </Box>
      </Container>

      {/* How a plan comes together: a real three-step sequence, so it is numbered */}
      <Box as="section" aria-labelledby="how-heading" py={['72px', '96px', '120px']}>
        <Container>
          <Box
            display="grid"
            gridTemplateColumns={['1fr', '1fr', '1fr', 'minmax(0, 4fr) minmax(0, 7fr)']}
            gridGap={['40px', '48px', '48px', '72px']}>
            <Box position={['static', 'static', 'static', 'sticky']} top="40px" alignSelf="start">
              <Text as="h2" id="how-heading" textStyle="display" maxW="12ch">
                How a plan comes together
              </Text>
              <Text mt="16px" color="muted" fontSize="17px" lineHeight="1.6" maxW="40ch">
                The planner uses DeepSeek to read your brief alongside your team&apos;s roles,
                skills and open work. You stay in the loop at every step.
              </Text>
            </Box>
            <Box as="ol" listStyleType="none" display="flex" flexDirection="column">
              {steps.map((step, i) => (
                <Box
                  as="li"
                  key={step.title}
                  display="grid"
                  gridTemplateColumns={['44px minmax(0, 1fr)', '56px minmax(0, 1fr)']}
                  gridColumnGap={['14px', '20px']}
                  pb={i === steps.length - 1 ? 0 : ['44px', '56px']}
                  position="relative">
                  {/* The rail joining the steps */}
                  {i < steps.length - 1 && (
                    <Box
                      position="absolute"
                      left={['21px', '27px']}
                      top="48px"
                      bottom="0"
                      width="2px"
                      bg="line"
                      aria-hidden="true"
                    />
                  )}
                  <Box
                    width={['44px', '56px']}
                    height={['44px', '56px']}
                    borderRadius="control"
                    bg={i === 1 ? 'gold.500' : 'night'}
                    color={i === 1 ? 'night' : 'white'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize={['18px', '22px']}
                    fontWeight={760}
                    sx={{ fontStretch: '125%', fontVariantNumeric: 'tabular-nums' }}
                    aria-hidden="true">
                    {i + 1}
                  </Box>
                  <Box minWidth="0" pt={['8px', '12px']}>
                    <Heading as="h3" fontSize={['19px', '22px']} sx={{ fontStretch: '115%' }}>
                      {step.title}
                    </Heading>
                    <Text mt="8px" color="muted" fontSize="16px" lineHeight="1.6" maxW="56ch">
                      {step.body}
                    </Text>
                    <Box mt="20px" maxW="520px">
                      {step.fragment}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* The board itself */}
      <Box
        as="section"
        aria-labelledby="board-heading"
        bg="surface"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="line"
        py={['64px', '88px']}>
        <Container>
          <Box
            display="grid"
            gridTemplateColumns={['1fr', '1fr', '1fr', 'minmax(0, 4fr) minmax(0, 7fr)']}
            gridGap={['32px', '40px', '40px', '72px']}>
            <Box>
              <Text as="h2" id="board-heading" textStyle="display" maxW="13ch">
                Still a board you run by hand
              </Text>
              <Text mt="16px" color="muted" fontSize="17px" lineHeight="1.6" maxW="40ch">
                You can skip the planner entirely. Every board works the same whether its cards were
                drafted or typed.
              </Text>
            </Box>
            <Box
              as="ul"
              listStyleType="none"
              display="grid"
              gridTemplateColumns={['1fr', 'repeat(2, minmax(0, 1fr))']}
              borderTop="1px solid"
              borderColor="line">
              {boardFeatures.map((feature) => (
                <Box
                  as="li"
                  key={feature.title}
                  display="flex"
                  sx={{ gap: '14px' }}
                  py="20px"
                  pr="20px"
                  borderBottom="1px solid"
                  borderColor="line">
                  <Box color="lapis" pt="3px" flexShrink={0} aria-hidden="true">
                    <feature.icon size="18px" />
                  </Box>
                  <Box>
                    <Text fontWeight={650} fontSize="16px">
                      {feature.title}
                    </Text>
                    <Text color="muted" fontSize="15px" mt="2px" lineHeight="1.5">
                      {feature.body}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Closing call to action */}
      <Box as="section" py={['56px', '80px']}>
        <Container>
          <Box
            bg="night"
            color="white"
            borderRadius="sheet"
            px={['22px', '40px', '56px']}
            py={['36px', '48px', '56px']}
            display="grid"
            gridTemplateColumns={['1fr', '1fr', 'minmax(0, 1fr) auto']}
            gridGap="28px"
            alignItems="center">
            <Box>
              <Box color="gold.300">
                <AiMark size={22} />
              </Box>
              <Text as="h2" textStyle="display" color="white" mt="14px" maxW="18ch">
                Bring your next brief
              </Text>
              <Text mt="12px" color="whiteAlpha.800" fontSize="17px" maxW="48ch" lineHeight="1.6">
                Create a board, invite your team, add everyone&apos;s skills, then describe the work
                and review the first draft.
              </Text>
            </Box>
            <Flex sx={{ gap: '10px' }} flexWrap="wrap">
              <Link href="/signup" passHref>
                <Button
                  as="a"
                  size="lg"
                  fontSize="16px"
                  bg="gold.500"
                  color="night"
                  _hover={{ bg: 'gold.400' }}
                  _active={{ bg: 'gold.600' }}>
                  Create an account
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button as="a" size="lg" fontSize="16px" variant="onNight">
                  Log in
                </Button>
              </Link>
            </Flex>
          </Box>
        </Container>
      </Box>

      <Box as="footer" pb="40px">
        <Container>
          <Flex
            justifyContent="space-between"
            alignItems={['flex-start', 'center']}
            flexDirection={['column', 'row']}
            sx={{ gap: '16px' }}
            pt="24px"
            borderTop="1px solid"
            borderColor="line">
            <TesseraLogo size={20} fontSize="17px" />
            <Flex as="nav" aria-label="Footer" sx={{ gap: '20px' }} fontSize="14px" color="muted">
              <Link href="/login" passHref>
                <Box as="a" _hover={{ color: 'ink' }}>
                  Log in
                </Box>
              </Link>
              <Link href="/signup" passHref>
                <Box as="a" _hover={{ color: 'ink' }}>
                  Create an account
                </Box>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default WelcomeScreen;
