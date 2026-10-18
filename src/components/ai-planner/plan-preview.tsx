import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, Collapse, Text, useToast } from '@chakra-ui/react';
import { FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { fetchColumns } from '@/src/slices/columns';
import { fetchCards } from '@/src/slices/cards';
import checkEnvironment from '@/util/check-environment';
import {
  ApplyResponse,
  ChatMessage,
  Member,
  Plan,
  PlanTask,
  defaultPriorityColors,
  labelColors
} from '@/src/types/ai';

type Props = {
  plan: Plan;
  members: Member[];
  messages: ChatMessage[];
  boardId: string;
  isLocked: boolean;
  isPlanning: boolean;
  onRegenerate: () => void;
  onApplied: () => void;
};

const Detail = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box mt="10px">
    <Text fontSize="12px" fontWeight={650} color="ink">
      {title}
    </Text>
    <Box fontSize="13px" color="muted" mt="2px" lineHeight="1.5">
      {children}
    </Box>
  </Box>
);

type RowProps = {
  task: PlanTask;
  assignee: Member | null;
  priorityColor: string;
};

// A task row opens in place to show why it was assigned, so the reasoning works on touch and keyboard too
const TaskRow = ({ task, assignee, priorityColor }: RowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const detailId = `plan-task-${task.ref}`;

  return (
    <Box
      bg="surface"
      border="1px solid"
      borderColor={isOpen ? 'lineStrong' : 'line'}
      borderRadius="control"
      overflow="hidden"
      transition="border-color 140ms">
      <Box
        as="button"
        type="button"
        width="100%"
        textAlign="left"
        display="flex"
        alignItems="stretch"
        aria-expanded={isOpen}
        aria-controls={detailId}
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: 'marble' }}
        transition="background-color 140ms">
        <Box width="4px" flexShrink={0} bg={priorityColor} aria-hidden="true" />
        <Box flex="1" minWidth="0" px="12px" py="10px">
          <Text fontSize="14px" fontWeight={600} lineHeight="1.35">
            {task.title}
          </Text>
          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: '10px' }}
            mt="6px"
            fontSize="12px"
            color="muted">
            <Box as="span" display="inline-flex" alignItems="center" sx={{ gap: '5px' }}>
              <Box
                as="span"
                width="8px"
                height="8px"
                borderRadius="2px"
                bg={labelColors[task.label] || 'lineStrong'}
              />
              {task.label}
            </Box>
            <Box as="span">{task.priority} priority</Box>
            <Box as="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {task.estimateHours}h
            </Box>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              sx={{ gap: '6px' }}
              ml="auto"
              color="ink">
              {assignee ? (
                <>
                  <Avatar size="2xs" name={assignee.fullName} bg="night" color="white" />
                  {assignee.fullName}
                </>
              ) : (
                <Box as="span" color="muted">
                  Unassigned
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          pr="10px"
          color="muted"
          transition="transform 200ms"
          transform={isOpen ? 'rotate(180deg)' : 'none'}
          aria-hidden="true">
          <FiChevronDown />
        </Box>
      </Box>
      <Collapse in={isOpen} animateOpacity>
        <Box id={detailId} px="16px" pb="12px" pt="2px" borderTop="1px solid" borderColor="line">
          <Detail title="Why this assignee">
            {task.assignmentReason || 'No assignment reason given.'}
          </Detail>
          {task.requiredSkills?.length > 0 && (
            <Detail title="Skills needed">{task.requiredSkills.join(', ')}</Detail>
          )}
          {task.dependsOn?.length > 0 && (
            <Detail title="Depends on">{task.dependsOn.join(', ')}</Detail>
          )}
          {task.acceptanceCriteria?.length > 0 && (
            <Detail title="Done when">
              <Box as="ul" pl="16px">
                {task.acceptanceCriteria.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </Box>
            </Detail>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

const PlanPreview = ({
  plan,
  members,
  messages,
  boardId,
  isLocked,
  isPlanning,
  onRegenerate,
  onApplied
}: Props): JSX.Element => {
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  const memberById: Record<string, Member> = {};
  members.forEach((m) => (memberById[m._id] = m));

  // Tasks pointing at a column the plan doesn't list still need a home
  const columns = [...plan.columns];
  plan.tasks.forEach((t) => {
    if (!columns.includes(t.column)) columns.push(t.column);
  });

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      const response = await fetch(`${checkEnvironment()}/api/ai/apply`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, plan, messages })
      });
      const json = await response.json().catch(() => ({}));

      if (!response.ok || json.error) {
        throw new Error(json.error || `Could not create cards (${response.status})`);
      }

      const { cardsCreated, columnsCreated } = json as ApplyResponse;
      toast({
        title: `Created ${cardsCreated} cards in ${columnsCreated} columns`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      if (isLocked) {
        await dispatch(fetchColumns());
        await dispatch(fetchCards());
      } else {
        router.push(`/boards/${boardId}`);
      }

      // Clearing the plan unmounts this preview, so stop loading first
      setIsCreating(false);
      onApplied();
    } catch (e) {
      setIsCreating(false);
      toast({
        title: 'Could not create the plan',
        description: e.message,
        status: 'error',
        duration: 6000,
        isClosable: true
      });
    }
  };

  const totalHours = plan.tasks.reduce((sum, t) => sum + (Number(t.estimateHours) || 0), 0);
  const assigned = plan.tasks.filter((t) => t.assigneeId && memberById[t.assigneeId]).length;
  const priorityColors = { ...defaultPriorityColors, ...plan.priorityColors };

  const stats = [
    { value: plan.tasks.length, label: plan.tasks.length === 1 ? 'task' : 'tasks' },
    { value: columns.length, label: columns.length === 1 ? 'column' : 'columns' },
    { value: `${totalHours}h`, label: 'estimated' },
    { value: `${assigned}/${plan.tasks.length}`, label: 'assigned' }
  ];

  return (
    <Box
      mt="18px"
      bg="surface"
      border="1px solid"
      borderColor="lineStrong"
      borderRadius="panel"
      boxShadow="raised">
      <Box px="16px" pt="14px" pb="12px" borderBottom="1px solid" borderColor="line">
        <Text textStyle="sectionTitle">Draft plan</Text>
        <Text fontSize="13px" color="muted" mt="2px">
          Nothing is on the board yet. Open a task to see why it went to that person.
        </Text>
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          mt="12px"
          border="1px solid"
          borderColor="line"
          borderRadius="control"
          overflow="hidden">
          {stats.map((stat, i) => (
            <Box
              key={stat.label}
              px="10px"
              py="8px"
              borderLeft={i === 0 ? 'none' : '1px solid'}
              borderColor="line">
              <Text
                fontSize="17px"
                fontWeight={700}
                lineHeight="1.2"
                sx={{ fontVariantNumeric: 'tabular-nums', fontStretch: '112%' }}>
                {stat.value}
              </Text>
              <Text fontSize="12px" color="muted">
                {stat.label}
              </Text>
            </Box>
          ))}
        </Box>
        <Box display="flex" flexWrap="wrap" sx={{ gap: '14px' }} mt="10px" fontSize="12px">
          {(['high', 'medium', 'low'] as const).map((p) => (
            <Box key={p} display="inline-flex" alignItems="center" sx={{ gap: '6px' }}>
              <Box width="4px" height="12px" borderRadius="1px" bg={priorityColors[p]} />
              <Text as="span" color="muted">
                {p.charAt(0).toUpperCase() + p.slice(1)} priority
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      <Box px="16px" py="6px">
        {columns.map((column) => {
          const tasks = plan.tasks.filter((t) => t.column === column);

          return (
            <Box key={column} py="10px">
              <Box display="flex" alignItems="baseline" sx={{ gap: '8px' }} mb="8px">
                <Text fontSize="13px" fontWeight={650}>
                  {column}
                </Text>
                <Text fontSize="12px" color="muted" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {tasks.length}
                </Text>
              </Box>
              {tasks.length === 0 && (
                <Text fontSize="13px" color="muted">
                  No tasks in this column.
                </Text>
              )}
              <Box display="flex" flexDirection="column" sx={{ gap: '6px' }}>
                {tasks.map((task) => (
                  <TaskRow
                    key={task.ref}
                    task={task}
                    assignee={task.assigneeId ? memberById[task.assigneeId] || null : null}
                    priorityColor={priorityColors[task.priority] || '#C8CAD2'}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ gap: '8px' }}
        px="16px"
        py="12px"
        borderTop="1px solid"
        borderColor="line"
        bg="marble"
        borderBottomRadius="panel">
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<FiRefreshCw />}
          onClick={onRegenerate}
          isDisabled={isPlanning || isCreating}>
          Regenerate
        </Button>
        <Button
          size="sm"
          colorScheme="brand"
          onClick={handleCreate}
          isLoading={isCreating}
          loadingText="Creating"
          isDisabled={isPlanning || plan.tasks.length === 0 || !boardId}>
          Create on board
        </Button>
      </Box>
    </Box>
  );
};

export default PlanPreview;
