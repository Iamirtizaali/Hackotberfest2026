import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import StatusPage from '@/src/components/app-shell/status-page';

const NotFoundPage = () => {
  return (
    <StatusPage
      code="404"
      title="There's no page here"
      description="The link may be mistyped, or the board it pointed to was deleted."
      actions={
        <>
          <Link href="/boards" passHref>
            <Button as="a" colorScheme="brand">
              Go to your boards
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button as="a" variant="quiet">
              Tessera home
            </Button>
          </Link>
        </>
      }
    />
  );
};

export default NotFoundPage;
