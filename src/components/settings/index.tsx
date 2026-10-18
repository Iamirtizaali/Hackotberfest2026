import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Heading,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/src/hooks';
import { saveProfile } from '@/src/slices/user';
import PageHeader from '@/src/components/app-shell/page-header';

const SKILL_SUGGESTIONS = [
  'React',
  'Next.js',
  'Node.js',
  'MongoDB',
  'TypeScript',
  'UI/UX',
  'Figma',
  'QA',
  'Testing',
  'DevOps',
  'Docker',
  'Project Management'
];

const MAX_SKILLS = 20;
const MAX_SKILL_LENGTH = 40;

const Settings = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const user = useAppSelector((state) => state.user);

  const [role, setRole] = useState(user?.role || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');

  // Sync local form state once the user profile has been fetched
  useEffect(() => {
    setRole(user?.role || '');
    setSkills(user?.skills || []);
  }, [user?.role, user?.skills]);

  const rows = [
    { label: 'Name', value: user?.fullName },
    { label: 'Email', value: user?.email }
  ];

  const addSkill = (value: string) => {
    const skill = value.trim().slice(0, MAX_SKILL_LENGTH);

    if (!skill) return;

    setSkills((current) => {
      if (current.length >= MAX_SKILLS) return current;
      if (current.some((s) => s.toLowerCase() === skill.toLowerCase())) return current;

      return [...current, skill];
    });
  };

  const removeSkill = (skill: string) => {
    setSkills((current) => current.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput('');
    } else if (e.key === 'Backspace' && !skillInput && skills.length) {
      setSkills((current) => current.slice(0, -1));
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Handle pasted comma-separated lists
    if (value.includes(',')) {
      const parts = value.split(',');
      parts.slice(0, -1).forEach(addSkill);
      setSkillInput(parts[parts.length - 1]);
    } else {
      setSkillInput(value);
    }
  };

  const handleSave = async () => {
    const pending = skillInput.trim();
    const nextSkills =
      pending && !skills.some((s) => s.toLowerCase() === pending.toLowerCase())
        ? [...skills, pending]
        : skills;

    setSkillInput('');

    const result = await dispatch(saveProfile({ skills: nextSkills, role }));

    if (saveProfile.fulfilled.match(result)) {
      toast({ title: 'Profile saved', status: 'success', duration: 3000, isClosable: true });
    } else {
      const payload = result.payload as { message?: string } | undefined;

      toast({
        title: 'Could not save profile',
        description: payload?.message || 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    }
  };

  const suggestions = SKILL_SUGGESTIONS.filter(
    (s) => !skills.some((skill) => skill.toLowerCase() === s.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Settings" description="Your account details." />
      <Box bg="surface" border="1px solid" borderColor="line" borderRadius="panel" maxW="640px">
        <Box display="flex" alignItems="center" sx={{ gap: '14px' }} p="20px">
          <Avatar size="md" name={user?.fullName} bg="ink" color="white" />
          <Box minWidth="0">
            <Heading as="h2" fontSize="17px" isTruncated>
              {user?.fullName}
            </Heading>
            <Text fontSize="14px" color="muted" isTruncated>
              {user?.role || user?.email}
            </Text>
          </Box>
        </Box>
        {rows.map((row) => (
          <Box
            key={row.label}
            display="flex"
            flexDirection={['column', 'row']}
            borderTop="1px solid"
            borderColor="line"
            px="20px"
            py="14px"
            fontSize="14px">
            <Text width={['auto', '160px']} color="muted" flexShrink={0}>
              {row.label}
            </Text>
            <Text fontWeight={500} wordBreak="break-word">
              {row.value || '—'}
            </Text>
          </Box>
        ))}
      </Box>

      <Box
        bg="surface"
        border="1px solid"
        borderColor="line"
        borderRadius="panel"
        maxW="640px"
        mt="20px">
        <Box p="20px" pb="6px">
          <Heading as="h2" fontSize="17px">
            Work profile
          </Heading>
          <Text fontSize="14px" color="muted" mt="2px">
            The AI planner uses your role and skills to assign tasks to you.
          </Text>
        </Box>

        <Box
          display="flex"
          flexDirection={['column', 'row']}
          px="20px"
          py="14px"
          fontSize="14px"
          sx={{ gap: '8px' }}>
          <Text
            as="label"
            htmlFor="profile-role"
            width={['auto', '160px']}
            color="muted"
            flexShrink={0}
            pt="6px">
            Role
          </Text>
          <Input
            id="profile-role"
            size="sm"
            borderRadius="6px"
            placeholder="e.g. Frontend Developer"
            maxLength={60}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </Box>

        <Box
          display="flex"
          flexDirection={['column', 'row']}
          borderTop="1px solid"
          borderColor="line"
          px="20px"
          py="14px"
          fontSize="14px"
          sx={{ gap: '8px' }}>
          <Text
            as="label"
            htmlFor="profile-skills"
            width={['auto', '160px']}
            color="muted"
            flexShrink={0}
            pt="6px">
            Skills
          </Text>
          <Box flex="1" minWidth="0">
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              sx={{ gap: '6px' }}
              border="1px solid"
              borderColor="line"
              borderRadius="6px"
              px="6px"
              py="4px"
              minHeight="32px">
              {skills.map((skill) => (
                <Tag key={skill} size="sm" borderRadius="full" variant="subtle" colorScheme="blue">
                  <TagLabel>{skill}</TagLabel>
                  <TagCloseButton
                    aria-label={`Remove ${skill}`}
                    onClick={() => removeSkill(skill)}
                  />
                </Tag>
              ))}
              <Input
                id="profile-skills"
                variant="unstyled"
                size="sm"
                flex="1"
                minWidth="120px"
                px="4px"
                placeholder={skills.length ? 'Add a skill' : 'Type a skill and press Enter'}
                value={skillInput}
                isDisabled={skills.length >= MAX_SKILLS}
                maxLength={MAX_SKILL_LENGTH}
                onChange={handleSkillChange}
                onKeyDown={handleSkillKeyDown}
              />
            </Box>
            {suggestions.length > 0 && skills.length < MAX_SKILLS && (
              <Box display="flex" flexWrap="wrap" sx={{ gap: '6px' }} mt="10px">
                {suggestions.map((s) => (
                  <Button
                    key={s}
                    size="xs"
                    variant="outline"
                    borderRadius="full"
                    fontWeight={500}
                    color="muted"
                    borderColor="line"
                    onClick={() => addSkill(s)}>
                    + {s}
                  </Button>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="flex-end"
          borderTop="1px solid"
          borderColor="line"
          px="20px"
          py="12px">
          <Button
            size="sm"
            bg="ink"
            color="white"
            _hover={{ opacity: 0.9 }}
            isLoading={user?.isSaving}
            loadingText="Saving"
            onClick={handleSave}>
            Save profile
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Settings;
