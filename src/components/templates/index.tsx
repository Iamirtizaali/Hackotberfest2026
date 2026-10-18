import React from 'react';
import Link from 'next/link';
import { Box, Button, Text } from '@chakra-ui/react';
import PageHeader from '@/src/components/app-shell/page-header';
import { AiPlannerButton } from '@/src/components/ai-planner';

const Templates = (): JSX.Element => {
  return (
    <>
      <PageHeader
        title="Templates"
        description="Boards that start with their columns already set up."
      />
      <Box
        bg="marble"
        borderRadius="panel"
        px={['20px', '40px']}
        py={['32px', '44px']}
        display="grid"
        gridTemplateColumns={['1fr', '1fr', '1fr', '1fr 1fr']}
        gridGap={['28px', '28px', '28px', '48px']}
        alignItems="center">
        <Box>
          <Text as="h2" textStyle="sectionTitle" fontSize="18px">
            Templates aren&apos;t available yet
          </Text>
          <Text mt="8px" color="muted" fontSize="15px" lineHeight="1.6" maxW="48ch">
            Until they are, the AI planner can set up columns for you from a short description of
            the project. Or start from a blank board and add the columns your team uses.
          </Text>
          <Box display="flex" flexWrap="wrap" sx={{ gap: '8px' }} mt="20px">
            <AiPlannerButton size="md" fontSize="14px" />
            <Link href="/boards" passHref>
              <Button as="a" variant="quiet" fontSize="14px">
                Go to boards
              </Button>
            </Link>
          </Box>
        </Box>
        {/* An outline of a board waiting for its columns */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          gridGap="10px"
          aria-hidden="true">
          {['Backlog', 'In progress', 'Done'].map((name, i) => (
            <Box
              key={name}
              border="1.5px dashed"
              borderColor="lineStrong"
              borderRadius="control"
              p="10px"
              minHeight={['120px', '160px']}>
              <Box height="8px" width={`${60 - i * 12}%`} borderRadius="2px" bg="lineStrong" />
              {Array.from({ length: 3 - i }).map((_, j) => (
                <Box key={j} mt="10px" height="22px" borderRadius="3px" bg="line" />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default Templates;
