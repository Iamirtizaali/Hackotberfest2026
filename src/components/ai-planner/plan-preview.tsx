import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Badge, Box, Button, Text, Tooltip, useToast } from '@chakra-ui/react';
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

const TaskTooltip = ({ task }: { task: PlanTask }) => (
  <Box fontSize="12px" py="2px">
    <Text>{task.assignmentReason || 'No assignment reason given.'}</Text>
    {task.requiredSkills?.length > 0 && (
      <Text mt="4px">
        <strong>Skills:</strong> {task.requiredSkills.join(', ')}
      </Text>
    )}
    {task.dependsOn?.length > 0 && (
      <Text mt="4px">
        <strong>Depends on:</strong> {task.dependsOn.join(', ')}
      </Text>
    )}
  </Box>
);

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
  const priorityColors = { ...defaultPriorityColors, ...plan.priorityColors };

  return (
    <Box mt="16px" bg="white" border="1px solid" borderColor="line" borderRadius="12px">
      <Box px="12px" py="10px" borderBottom="1px solid" borderColor="line">
        <Text fontSize="14px" fontWeight={600}>
          Plan preview
        </Text>
        <Text fontSize="12px" color="muted">
          {plan.tasks.length} tasks · {columns.length} columns · ~{totalHours}h
        </Text>
        <Box display="flex" flexWrap="wrap" sx={{ gap: '10px' }} mt="6px" fontSize="11px" color="muted">
          {(['high', 'medium', 'low'] as const).map((p) => (
            <Box key={p} display="inline-flex" alignItems="center" sx={{ gap: '4px' }}>
              <Box width="8px" height="8px" borderRadius="2px" bg={priorityColors[p]} />
              <Text as="span" textTransform="capitalize">
                {p} priority
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {columns.map((column) => {
        const tasks = plan.tasks.filter((t) => t.column === column);

        return (
          <Box key={column} px="12px" py="10px" borderBottom="1px solid" borderColor="line">
            <Text fontSize="12px" fontWeight={700} textTransform="uppercase" color="muted" mb="6px">
              {column} ({tasks.length})
            </Text>
            {tasks.length === 0 && (
              <Text fontSize="12px" color="muted">
                No tasks
              </Text>
            )}
            {tasks.map((task) => {
              const assignee = task.assigneeId ? memberById[task.assigneeId] : null;

              return (
                <Tooltip
                  key={task.ref}
                  label={<TaskTooltip task={task} />}
                  placement="left"
                  hasArrow
                  openDelay={200}>
                  <Box
                    py="6px"
                    px="8px"
                    mb="4px"
                    borderRadius="8px"
                    bg="plaster"
                    borderLeft="3px solid"
                    borderLeftColor={priorityColors[task.priority] || 'line'}
                    _hover={{ bg: 'line' }}
                    cursor="default">
                    <Text fontSize="13px" fontWeight={600}>
                      {task.title}
                    </Text>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{ gap: '6px' }}
                      mt="4px"
                      fontSize="11px">
                      <Badge
                        bg={labelColors[task.label] || 'gray.400'}
                        color="white"
                        fontSize="10px"
                        textTransform="lowercase">
                        {task.label}
                      </Badge>
                      <Badge
                        bg={priorityColors[task.priority] || 'gray.400'}
                        color="white"
                        fontSize="10px"
                        textTransform="lowercase">
                        {task.priority} priority
                      </Badge>
                      <Text color="muted">{task.estimateHours}h</Text>
                      <Box display="flex" alignItems="center" sx={{ gap: '4px' }} ml="auto">
                        {assignee ? (
                          <>
                            <Avatar size="2xs" name={assignee.fullName} />
                            <Text>{assignee.fullName}</Text>
                          </>
                        ) : (
                          <Text color="muted">Unassigned</Text>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        );
      })}

      <Box display="flex" justifyContent="flex-end" sx={{ gap: '8px' }} px="12px" py="10px">
        <Button
          size="sm"
          variant="ghost"
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
