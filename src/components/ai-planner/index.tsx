import React, { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
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
  IconButton,
  ListItem,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  Tooltip,
  UnorderedList,
  useDisclosure
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FiArrowUp, FiFileText, FiImage, FiPaperclip } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/src/hooks';
import { fetchBoards } from '@/src/slices/boards';
import checkEnvironment from '@/util/check-environment';
import PlanPreview from '@/src/components/ai-planner/plan-preview';
import { AiMark } from '@/src/components/brand/logo';
import {
  ACCEPT,
  MAX_FILES,
  fitsRequestLimit,
  readAttachment
} from '@/src/components/ai-planner/read-attachment';
import { ChatMessage, Member, Plan, PlanResponse, UploadAttachment } from '@/src/types/ai';

// Assistant turns also carry the plan's open questions and risks for display.
// User turns can carry uploaded files (kept for Regenerate) and the document text the
// server extracted from them (sent with later turns so refinements still see it).
type ThreadMessage = ChatMessage & {
  questions?: string[];
  risks?: string[];
  uploads?: UploadAttachment[];
  context?: string;
};

const FILE_ONLY_PROMPT = 'Generate tickets from the attached file(s).';

// Starting points shown before the first message; picking one fills the composer
const EXAMPLE_BRIEFS = [
  'Launch a mobile checkout in 3 weeks: payments, cart, order tracking.',
  'Redesign our marketing site in 4 weeks: new pages, CMS migration, analytics.',
  'Ship a customer feedback portal in 6 weeks with voting, comments and an admin view.'
];

const toApiMessages = (thread: ThreadMessage[]): ChatMessage[] =>
  thread.map(({ role, content }) => ({ role, content }));

// The latest message's files are uploaded again, so only earlier turns carry their extracted text
const toPlanMessages = (thread: ThreadMessage[]): ChatMessage[] =>
  thread.map(({ role, content, context }, i) => ({
    role,
    content: context && i < thread.length - 1 ? `${content}\n\n${context}` : content
  }));

const settle = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
  45% { transform: translateY(-4px) rotate(12deg); opacity: 1; }
`;

// Three tiles lifting in turn while the planner works
const PlanningIndicator = () => (
  <Box
    role="status"
    alignSelf="flex-start"
    display="flex"
    alignItems="center"
    sx={{ gap: '12px' }}
    bg="surface"
    border="1px solid"
    borderColor="line"
    borderRadius="panel"
    px="14px"
    py="12px"
    fontSize="14px"
    color="muted">
    <Box display="flex" sx={{ gap: '4px' }} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          width="9px"
          height="9px"
          borderRadius="2px"
          bg={i === 1 ? 'gold.500' : 'night'}
          sx={{ animation: `${settle} 1.1s ${i * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </Box>
    Drafting the plan with DeepSeek…
  </Box>
);

const FileChip = ({ file, onRemove }: { file: UploadAttachment; onRemove?: () => void }) => (
  <Tag
    size="md"
    variant="subtle"
    bg={file.isImage ? 'goldWash' : 'marble'}
    color="ink"
    border="1px solid"
    borderColor="line"
    borderRadius="control"
    maxW="100%">
    <TagLeftIcon as={file.isImage ? FiImage : FiFileText} color="muted" />
    <TagLabel isTruncated fontSize="13px">
      {file.name}
    </TagLabel>
    {onRemove && <TagCloseButton aria-label={`Remove ${file.name}`} onClick={onRemove} />}
  </Tag>
);

const SmallList = ({ title, items }: { title: string; items?: string[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box mt="12px" pt="10px" borderTop="1px solid" borderColor="line">
      <Text fontSize="13px" fontWeight={650}>
        {title}
      </Text>
      <UnorderedList fontSize="13px" ml="18px" mt="4px" spacing="3px" color="muted">
        {items.map((item, i) => (
          <ListItem key={i}>{item}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

type ContextValue = { open: () => void };

const AiPlannerContext = createContext<ContextValue>({ open: () => undefined });

export const useAiPlanner = (): ContextValue => useContext(AiPlannerContext);

type TriggerProps = ButtonProps & { label?: string };

// Any number of triggers can open the one planner drawer, so a draft survives between them
export const AiPlannerButton: FC<TriggerProps> = ({ label = 'Plan with AI', ...props }) => {
  const { open } = useAiPlanner();

  return (
    <Button variant="ai" leftIcon={<AiMark size={15} color="#141B4D" />} onClick={open} {...props}>
      {label}
    </Button>
  );
};

export const AiPlannerProvider: FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const dispatch = useDispatch();
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef<HTMLTextAreaElement>(null);

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
  const [pendingFiles, setPendingFiles] = useState<UploadAttachment[]>([]);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
    const latest = thread[thread.length - 1];

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
          messages: toPlanMessages(thread),
          previousPlan: plan || undefined,
          attachments: (latest?.uploads || []).map(({ name, type, data }) => ({
            name,
            type,
            data
          }))
        })
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.plan) {
        throw new Error(
          json.error ||
            (response.status === 413
              ? 'The attached files are too large. Try smaller files.'
              : `Planning failed (${response.status})`)
        );
      }

      const data = json as PlanResponse;
      const threadWithContext = data.attachmentContext
        ? thread.map((m, i) =>
            i === thread.length - 1 ? { ...m, context: data.attachmentContext } : m
          )
        : thread;

      setPlan(data.plan);
      setMembers(data.members || []);
      setMessages([
        ...threadWithContext,
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

  const addFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList || []);

    if (!files.length) return;
    setError('');

    if (pendingFiles.length + files.length > MAX_FILES) {
      setError(`Attach up to ${MAX_FILES} files at a time.`);
      return;
    }

    setIsReadingFiles(true);

    try {
      const read = await Promise.all(files.map(readAttachment));
      const next = [...pendingFiles, ...read];

      if (!fitsRequestLimit(next)) {
        setError('These files are too large together (about 3 MB max). Remove one and try again.');
        return;
      }

      setPendingFiles(next);
    } catch (e) {
      setError(e.message || 'Could not read that file.');
    } finally {
      setIsReadingFiles(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    // Allow picking the same file again after removing it
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!loading) addFiles(e.dataTransfer.files);
  };

  const handleSend = () => {
    const typed = draft.trim();
    if ((!typed && pendingFiles.length === 0) || loading || isReadingFiles || !targetBoardId) {
      return;
    }

    const uploads = pendingFiles;

    setDraft('');
    setPendingFiles([]);
    requestPlan([
      ...messages,
      {
        role: 'user',
        content: typed || FILE_ONLY_PROMPT,
        uploads: uploads.length ? uploads : undefined
      }
    ]);
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
    setPendingFiles([]);
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

  const applyExample = (text: string) => {
    setDraft(text);
    draftRef.current?.focus();
  };

  const membersWithoutSkills = members.filter((m) => !m.skills || m.skills.length === 0);
  const canSend = (draft.trim() || pendingFiles.length > 0) && !isReadingFiles && targetBoardId;
  const hasNoBoards = !isLocked && (!boards || boards.length === 0);

  return (
    <AiPlannerContext.Provider value={{ open: onOpen }}>
      {children}
      <Drawer
        size="md"
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        initialFocusRef={draftRef}>
        <DrawerOverlay />
        <DrawerContent maxW={['100vw', '560px']} bg="marble">
          <DrawerCloseButton color="white" top="14px" _hover={{ bg: 'whiteAlpha.200' }} />
          <DrawerHeader bg="night" color="white" pt="18px" pb="16px" px={['16px', '24px']}>
            <Box display="flex" alignItems="center" sx={{ gap: '10px' }} pr="36px">
              <AiMark size={18} />
              <Text as="span">AI planner</Text>
            </Box>
            {isLocked ? (
              <Text fontSize="14px" fontWeight={400} color="whiteAlpha.800" mt="6px" isTruncated>
                Planning for {currentBoard.name}
              </Text>
            ) : (
              <Box mt="12px" display="flex" alignItems="center" sx={{ gap: '10px' }}>
                <Text
                  as="label"
                  htmlFor="planner-board"
                  fontSize="13px"
                  fontWeight={500}
                  color="whiteAlpha.800"
                  flexShrink={0}>
                  Board
                </Text>
                <Select
                  id="planner-board"
                  size="sm"
                  color="ink"
                  placeholder={boards?.length ? 'Choose a board' : 'No boards yet'}
                  value={selectedBoardId}
                  onChange={handleBoardChange}>
                  {(boards || []).map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </Box>
            )}
          </DrawerHeader>

          <DrawerBody
            className="tessera-scroll"
            py="20px"
            px={['16px', '24px']}
            bg={isDragging ? 'goldWash' : 'marble'}
            outline={isDragging ? '2px dashed' : 'none'}
            outlineColor="gold.500"
            outlineOffset="-10px"
            transition="background-color 140ms"
            onDragOver={(e) => {
              e.preventDefault();
              if (!isDragging) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}>
            {messages.length === 0 && !loading && (
              <Box>
                <Text textStyle="sectionTitle">Describe the project</Text>
                <Text fontSize="14px" color="muted" mt="6px" lineHeight="1.6">
                  Include the goal, what is in scope and the deadline. The planner drafts columns
                  and task cards, then assigns each card to a board member whose skills fit. Keep
                  chatting to adjust the draft before anything is added to the board.
                </Text>
                <Text fontSize="13px" color="muted" mt="10px" lineHeight="1.6">
                  You can also attach or drop a spec (PDF, Word, PowerPoint, Excel, text) or an
                  image such as a wireframe or whiteboard photo.
                </Text>
                {hasNoBoards ? (
                  <Box
                    mt="20px"
                    p="14px"
                    bg="surface"
                    border="1px solid"
                    borderColor="line"
                    borderRadius="panel"
                    fontSize="14px">
                    The planner adds cards to an existing board.{' '}
                    <Link href="/boards" passHref>
                      <Box as="a" color="lapis" fontWeight={600} textDecoration="underline">
                        Create a board first
                      </Box>
                    </Link>
                    .
                  </Box>
                ) : (
                  <Box mt="20px">
                    <Text fontSize="13px" fontWeight={600} mb="8px">
                      Start from an example
                    </Text>
                    <Box display="flex" flexDirection="column" sx={{ gap: '6px' }}>
                      {EXAMPLE_BRIEFS.map((example) => (
                        <Box
                          as="button"
                          type="button"
                          key={example}
                          textAlign="left"
                          fontSize="14px"
                          lineHeight="1.45"
                          px="12px"
                          py="10px"
                          bg="surface"
                          border="1px solid"
                          borderColor="line"
                          borderRadius="control"
                          transition="border-color 140ms, transform 140ms"
                          _hover={{ borderColor: 'gold.400' }}
                          _active={{ transform: 'translateY(1px)' }}
                          onClick={() => applyExample(example)}>
                          {example}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            <Box display="flex" flexDirection="column" sx={{ gap: '12px' }}>
              {messages.map((m, i) => {
                const isUser = m.role === 'user';

                if (isUser) {
                  return (
                    <Box
                      key={i}
                      alignSelf="flex-end"
                      maxW="88%"
                      bg="night"
                      color="white"
                      borderRadius="12px 12px 4px 12px"
                      px="14px"
                      py="10px"
                      fontSize="14px"
                      lineHeight="1.5"
                      whiteSpace="pre-wrap">
                      {m.content}
                      {m.uploads && (
                        <Box display="flex" flexWrap="wrap" sx={{ gap: '4px' }} mt="8px">
                          {m.uploads.map((f) => (
                            <FileChip key={f.name} file={f} />
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                }

                return (
                  <Box
                    key={i}
                    alignSelf="flex-start"
                    maxW="94%"
                    bg="surface"
                    border="1px solid"
                    borderColor="line"
                    borderRadius="12px 12px 12px 4px"
                    px="14px"
                    py="12px"
                    fontSize="14px"
                    lineHeight="1.55">
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ gap: '6px' }}
                      mb="6px"
                      color="goldInk"
                      fontSize="12px"
                      fontWeight={650}>
                      <AiMark size={12} />
                      Planner
                    </Box>
                    <Text whiteSpace="pre-wrap">{m.content}</Text>
                    <SmallList title="Open questions" items={m.questions} />
                    <SmallList title="Risks" items={m.risks} />
                  </Box>
                );
              })}

              {loading && <PlanningIndicator />}
            </Box>

            {error && (
              <Alert status="error" mt="14px" fontSize="14px">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {membersWithoutSkills.length > 0 && (
              <Alert status="warning" mt="14px" fontSize="13px" py="8px" bg="goldWash">
                <AlertIcon boxSize="16px" color="gold.700" />
                <AlertDescription>
                  {membersWithoutSkills.map((m) => m.fullName).join(', ')}{' '}
                  {membersWithoutSkills.length === 1 ? 'has' : 'have'} no skills listed, so
                  assignments may be less accurate.{' '}
                  <Link href="/settings" passHref>
                    <Box as="a" textDecoration="underline" fontWeight={650}>
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
            bg="surface"
            flexDirection="column"
            alignItems="stretch"
            px={['12px', '20px']}
            py="14px">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPT}
              onChange={handleFileInput}
              style={{ display: 'none' }}
              aria-hidden="true"
              data-testid="ai-planner-file-input"
            />
            <Box
              border="1px solid"
              borderColor="lineStrong"
              borderRadius="panel"
              bg="surface"
              transition="border-color 140ms, box-shadow 140ms"
              _focusWithin={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #2B44C7' }}>
              {pendingFiles.length > 0 && (
                <Box display="flex" flexWrap="wrap" sx={{ gap: '6px' }} px="10px" pt="10px">
                  {pendingFiles.map((f, i) => (
                    <FileChip
                      key={`${f.name}-${i}`}
                      file={f}
                      onRemove={() => setPendingFiles(pendingFiles.filter((_, j) => j !== i))}
                    />
                  ))}
                </Box>
              )}
              <Textarea
                ref={draftRef}
                aria-label={plan ? 'Refine the plan' : 'Describe the project'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  plan
                    ? 'Refine the plan, e.g. "split the API work" or "give QA to Sara"'
                    : 'e.g. Launch a mobile checkout in 3 weeks: payments, cart, order tracking…'
                }
                rows={3}
                fontSize="15px"
                resize="none"
                variant="unstyled"
                px="12px"
                pt="10px"
                isDisabled={loading}
              />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px="8px"
                pb="8px">
                <Box display="flex" alignItems="center" sx={{ gap: '6px' }}>
                  <Tooltip label={`Attach a file or image (up to ${MAX_FILES})`}>
                    <IconButton
                      aria-label="Attach a file or image"
                      icon={<FiPaperclip />}
                      size="sm"
                      variant="ghost"
                      color="muted"
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={isReadingFiles}
                      isDisabled={loading || pendingFiles.length >= MAX_FILES}
                    />
                  </Tooltip>
                  <Text fontSize="12px" color="muted" display={['none', 'block']}>
                    Ctrl or ⌘ + Enter to send
                  </Text>
                </Box>
                <Button
                  colorScheme="brand"
                  size="sm"
                  rightIcon={<FiArrowUp />}
                  onClick={handleSend}
                  isLoading={loading}
                  loadingText="Planning"
                  isDisabled={!canSend}>
                  {plan ? 'Send' : 'Draft plan'}
                </Button>
              </Box>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AiPlannerContext.Provider>
  );
};

export default AiPlannerProvider;
