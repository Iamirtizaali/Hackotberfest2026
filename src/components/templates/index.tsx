import React from 'react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import PageHeader from '@/src/components/app-shell/page-header';
import EmptyState from '@/src/components/app-shell/empty-state';

const Templates = (): JSX.Element => {
  return (
    <>
      <PageHeader title="Templates" description="Start a board with columns already set up." />
      <EmptyState
        title="Templates are coming soon"
        description="Until then, start from a blank board and add the columns your team uses."
        action={
          <Link href="/boards" passHref>
            <Button as="a" variant="outline" borderColor="lineStrong" bg="surface">
              Go to boards
            </Button>
          </Link>
        }
      />
    </>
  );
};

export default Templates;
