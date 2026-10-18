import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  FormLabel,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
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

// Settings read as a ledger: what a section is for on the left, its fields on the right
const Section: React.FC<{ title: string; description: string }> = ({
  title,
  description,
  children
}) => (
  <Box
    as="section"
    display="grid"
    gridTemplateColumns={['1fr', '1fr', '1fr', '260px minmax(0, 640px)']}
    gridGap={['14px', '14px', '14px', '40px']}
    pb={['32px', '40px']}
    mb={['32px', '40px']}
    borderBottom="1px solid"
    borderColor="line"
    _last={{ borderBottom: 'none', mb: 0 }}>
    <Box>
      <Text as="h2" textStyle="sectionTitle">
        {title}
      </Text>
      <Text fontSize="14px" color="muted" mt="6px" lineHeight="1.55">
        {description}
      </Text>
    </Box>
    <Box bg="surface" border="1px solid" borderColor="line" borderRadius="panel" boxShadow="tile">
      {children}
    </Box>
  </Box>
);

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

  const isDirty =
    role !== (user?.role || '') ||
    skillInput.trim() !== '' ||
    skills.join('|') !== (user?.skills || []).join('|');

  return (
    <>
      <PageHeader
        title="Settings"
        description="Your account and the work profile the AI planner reads."
      />

      <Section
        title="Account"
        description="Your name and email come from sign-up and are shown to people on your boards.">
        <Box display="flex" alignItems="center" sx={{ gap: '14px' }} p="20px">
          <Avatar size="md" name={user?.fullName} bg="night" color="white" />
          <Box minWidth="0">
            <Text fontSize="16px" fontWeight={650} isTruncated>
              {user?.fullName}
            </Text>
            <Text fontSize="14px" color="muted" isTruncated>
              {user?.role || 'No role set'}
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
            fontSize="14px"
            sx={{ gap: '4px' }}>
            <Text width={['auto', '140px']} color="muted" flexShrink={0}>
              {row.label}
            </Text>
            <Text fontWeight={560} wordBreak="break-word">
              {row.value || '—'}
            </Text>
          </Box>
        ))}
      </Section>

      <Section
        title="Work profile"
        description="The AI planner matches cards to people by role and skills. A short, accurate list gives better assignments than a long one.">
        <Box px="20px" pt="20px">
          <FormLabel htmlFor="profile-role">Role</FormLabel>
          <Input
            id="profile-role"
            placeholder="e.g. Frontend Developer"
            maxLength={60}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </Box>

        <Box px="20px" pt="20px" pb="20px">
          <FormLabel htmlFor="profile-skills">Skills</FormLabel>
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            sx={{ gap: '6px' }}
            border="1px solid"
            borderColor="lineStrong"
            borderRadius="control"
            bg="surface"
            px="8px"
            py="6px"
            minHeight="40px"
            transition="border-color 140ms, box-shadow 140ms"
            _hover={{ borderColor: '#9DA1AE' }}
            _focusWithin={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #2B44C7' }}>
            {skills.map((skill) => (
              <Tag
                key={skill}
                size="md"
                borderRadius="tile"
                bg="brand.50"
                color="brand.700"
                fontWeight={560}>
                <TagLabel>{skill}</TagLabel>
                <TagCloseButton aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)} />
              </Tag>
            ))}
            <Input
              id="profile-skills"
              variant="unstyled"
              size="sm"
              flex="1"
              minWidth="140px"
              px="4px"
              fontSize="14px"
              placeholder={skills.length ? 'Add a skill' : 'Type a skill and press Enter'}
              value={skillInput}
              isDisabled={skills.length >= MAX_SKILLS}
              maxLength={MAX_SKILL_LENGTH}
              onChange={handleSkillChange}
              onKeyDown={handleSkillKeyDown}
            />
          </Box>
          <Text fontSize="13px" color="muted" mt="6px">
            Press Enter or type a comma after each skill. Up to {MAX_SKILLS}.
          </Text>
          {suggestions.length > 0 && skills.length < MAX_SKILLS && (
            <Box mt="14px">
              <Text fontSize="13px" fontWeight={600} mb="8px">
                Common skills
              </Text>
              <Box display="flex" flexWrap="wrap" sx={{ gap: '6px' }}>
                {suggestions.map((s) => (
                  <Button
                    key={s}
                    size="xs"
                    height="28px"
                    variant="quiet"
                    borderRadius="tile"
                    fontWeight={500}
                    fontSize="13px"
                    color="muted"
                    leftIcon={<FiPlus />}
                    iconSpacing="4px"
                    onClick={() => addSkill(s)}>
                    {s}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ gap: '12px' }}
          borderTop="1px solid"
          borderColor="line"
          bg="marble"
          borderBottomRadius="panel"
          px="20px"
          py="12px">
          <Text fontSize="13px" color="muted" aria-live="polite">
            {isDirty ? 'You have unsaved changes.' : 'All changes saved.'}
          </Text>
          <Button
            size="sm"
            colorScheme="brand"
            isLoading={user?.isSaving}
            loadingText="Saving"
            onClick={handleSave}>
            Save profile
          </Button>
        </Box>
      </Section>
    </>
  );
};

export default Settings;
