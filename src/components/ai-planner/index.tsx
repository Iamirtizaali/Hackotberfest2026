import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  ButtonProps,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  ListItem,
  Select,
  Spinner,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/hooks';
import { fetchBoards } from '@/src/slices/boards';
import checkEnvironment from '@/util/check-environment';
import PlanPreview from '@/src/components/ai-planner/plan-preview';
import { ChatMessage, Member, Plan, PlanResponse } from '@/src/types/ai';

type Props = {
  buttonProps?: ButtonProps | Record<string, unknown>;
};

// Assistant turns also carry the plan's open questions and risks for display
type ThreadMessage = ChatMessage & { questions?: string[]; risks?: string[] };

const defaultButtonProps = { size: 'sm', colorScheme: 'brand' };

const toApiMessages = (thread: ThreadMessage[]): ChatMessage[] =>
  thread.map(({ role, content }) => ({ role, content }));

const SmallList = ({ title, items }: { title: string; items?: string[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box mt="8px">
      <Text fontSize="12px" fontWeight={600}>
        {title}
      </Text>
      <UnorderedList fontSize="12px" ml="16px" spacing="2px">
        {items.map((item, i) => (
          <ListItem key={i}>{item}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

const AiPlanner = ({ buttonProps = defaultButtonProps }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const dispatch = useDispatch();
  const btnRef = useRef();
  const endRef = useRef<HTMLDivElement>(null);

  const currentBoard = useAppSelector((state) => state.board.board);
  const boards = useAppSelector((state) => state.boards.boards);

  const isLocked = router.pathname === '/boards/[slug]' && Boolean(currentBoard?._id);

  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState('');

  const targetBoardId = isLocked ? currentBoard._id : selectedBoardId;

  useEffect(() => {
    if (isOpen && !isLocked) dispatch(fetchBoards());
  }, [isOpen, isLocked]);

  // Default to the first board so the planner is usable straight away
  useEffect(() => {
    if (!isLocked && !selectedBoardId && boards?.length > 0) {
      setSelectedBoardId(boards[0]._id);
    }
  }, [boards, isLocked, selectedBoardId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading, plan]);

  const requestPlan = async (thread: ThreadMessage[]) => {
    setMessages(thread);
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${checkEnvironment()}/api/ai/plan`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardId: targetBoardId,
          messages: toApiMessages(thread),
          previousPlan: plan || undefined
        })
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.plan) {
        throw new Error(json.error || `Planning failed (${response.status})`);
      }

      const data = json as PlanResponse;
      setPlan(data.plan);
      setMembers(data.members || []);
      setMessages([
        ...thread,
        {
          role: 'assistant',
          content: data.plan.summary,
          questions: data.plan.questions,
          risks: data.plan.risks
        }
      ]);
    } catch (e) {
      setError(e.message || 'Something went wrong while planning.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    const content = draft.trim();
    if (!content || loading || !targetBoardId) return;

    setDraft('');
    requestPlan([...messages, { role: 'user', content }]);
  };

  const handleRegenerate = () => {
    let lastUser = -1;
    messages.forEach((m, i) => {
      if (m.role === 'user') lastUser = i;
    });
    if (lastUser === -1 || loading) return;

    requestPlan(messages.slice(0, lastUser + 1));
  };

  const handleApplied = () => {
    setPlan(null);
    setMembers([]);
    setMessages([]);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBoardId(e.target.value);
    // A plan is built from one board's members, so start over on a new board
    handleApplied();
  };

  const membersWithoutSkills = members.filter((m) => !m.skills || m.skills.length === 0);

  return (
    <>
      <Button ref={btnRef} onClick={onOpen} {...buttonProps}>
        ✨ AI Planner
      </Button>
      <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid" borderColor="line">
            <Text>✨ AI Planner</Text>
            {isLocked ? (
              <Text fontSize="13px" fontWeight={400} color="muted" mt="4px">
                Planning for <strong>{currentBoard.name}</strong>
              </Text>
            ) : (
              <Select
                mt="8px"
                size="sm"
                placeholder={boards?.length ? 'Choose a board' : 'No boards yet'}
                value={selectedBoardId}
                onChange={handleBoardChange}
                aria-label="Target board">
                {(boards || []).map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            )}
          </DrawerHeader>

          <DrawerBody py="16px" bg="plaster">
            {messages.length === 0 && !loading && (
              <Box fontSize="14px" color="muted" textAlign="center" mt="32px" px="16px">
                Describe your project — goals, scope, deadline — and DeepSeek will draft columns and
                task cards, assigning them to board members by skill. Keep chatting to refine it.
              </Box>
            )}

            <Box display="flex" flexDirection="column" sx={{ gap: '10px' }}>
              {messages.map((m, i) => {
                const isUser = m.role === 'user';

                return (
                  <Box
                    key={i}
                    alignSelf={isUser ? 'flex-end' : 'flex-start'}
                    maxW="85%"
                    bg={isUser ? 'brand.500' : 'white'}
                    color={isUser ? 'white' : 'ink'}
                    border={isUser ? 'none' : '1px solid'}
                    borderColor="line"
                    borderRadius="12px"
                    px="12px"
                    py="8px"
                    fontSize="14px"
                    whiteSpace="pre-wrap">
                    {m.content}
                    {!isUser && (
                      <>
                        <SmallList title="Open questions" items={m.questions} />
                        <SmallList title="Risks" items={m.risks} />
                      </>
                    )}
                  </Box>
                );
              })}

              {loading && (
                <Box
                  alignSelf="flex-start"
                  display="flex"
                  alignItems="center"
                  sx={{ gap: '8px' }}
                  bg="white"
                  border="1px solid"
                  borderColor="line"
                  borderRadius="12px"
                  px="12px"
                  py="8px"
                  fontSize="14px"
                  color="muted">
                  <Spinner size="sm" />
                  Planning with DeepSeek…
                </Box>
              )}
            </Box>

            {error && (
              <Alert status="error" mt="12px" borderRadius="8px" fontSize="13px">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {membersWithoutSkills.length > 0 && (
              <Alert status="warning" mt="12px" borderRadius="8px" fontSize="12px" py="6px">
                <AlertIcon boxSize="14px" />
                <AlertDescription>
                  {membersWithoutSkills.map((m) => m.fullName).join(', ')}{' '}
                  {membersWithoutSkills.length === 1 ? 'has' : 'have'} no skills listed, so
                  assignments may be less accurate.{' '}
                  <Link href="/settings" passHref>
                    <Box as="a" textDecoration="underline" fontWeight={600}>
                      Add skills in Settings
                    </Box>
                  </Link>
                </AlertDescription>
              </Alert>
            )}

            {plan && (
              <PlanPreview
                plan={plan}
                members={members}
                messages={toApiMessages(messages)}
                boardId={targetBoardId}
                isLocked={isLocked}
                isPlanning={loading}
                onRegenerate={handleRegenerate}
                onApplied={handleApplied}
              />
            )}

            <div ref={endRef} />
          </DrawerBody>

          <DrawerFooter
            borderTop="1px solid"
            borderColor="line"
            flexDirection="column"
            alignItems="stretch">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                plan
                  ? 'Refine the plan, e.g. "split the API work" or "give QA to Sara"'
                  : 'e.g. Launch a mobile checkout in 3 weeks: payments, cart, order tracking…'
              }
              rows={3}
              fontSize="14px"
              resize="none"
              isDisabled={loading}
            />
            <Box display="flex" alignItems="center" justifyContent="space-between" mt="8px">
              <Text fontSize="12px" color="muted">
                Ctrl/⌘ + Enter to send
              </Text>
              <Button
                colorScheme="brand"
                size="sm"
                onClick={handleSend}
                isLoading={loading}
                isDisabled={!draft.trim() || !targetBoardId}>
                Send
              </Button>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AiPlanner;
