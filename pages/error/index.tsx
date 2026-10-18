import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import StatusPage from '@/src/components/app-shell/status-page';

const ErrorPage = () => {
  return (
    <StatusPage
      title="This invite link doesn't work"
      description="It may have expired or already been used. Ask the board owner to send you a new invite."
      actions={
        <>
          <Link href="/login" passHref>
            <Button as="a" colorScheme="brand">
              Log in
            </Button>
          </Link>
          <Link href="/" passHref>
            <Button as="a" variant="quiet">
              Go to Tessera
            </Button>
          </Link>
        </>
      }
    />
  );
};

export default ErrorPage;
