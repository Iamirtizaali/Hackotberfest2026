import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Alert,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import checkEnvironment from '@/util/check-environment';
import { useRouter } from 'next/router';
import inviteUser from '@/util/invite-user';
import AuthLayout from '@/src/components/auth-layout';
import PasswordInput from '@/src/components/auth-layout/password-input';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setErrorState] = useState<false | 'credentials' | 'server'>(false);

  const host = checkEnvironment();
  const router = useRouter();

  const loginUser = async (e) => {
    e.preventDefault();
    setIsFetching(true);

    const data = {
      email: values.email,
      password: values.password
    };

    const url = `${host}/api/login`;

    let response: Response;
    let result;

    try {
      response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      });

      // A crashed server responds with an HTML error page, so don't assume JSON
      result = await response.json().catch(() => ({}));
    } catch (err) {
      result = {};
    }

    setIsFetching(false);

    if (!response || response.status >= 500) {
      setErrorState('server');

      return;
    }

    const { email: inviteEmail, token, boardId } = router.query;
    const isInvitedUser = inviteEmail && token && boardId;

    if (isInvitedUser && result.message === 'success') {
      const hasInvited = await inviteUser({ email: inviteEmail, boardId });

      if (hasInvited) {
        window.location.href = `${window.location.origin}/home`;
      }
    } else if (result.message === 'success') {
      window.location.href = `${window.location.origin}/home`;
    }

    if (response.status === 404) {
      setErrorState('credentials');
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const showLoginError = () => {
    if (!hasError) return;

    return (
      <Alert status="error" mb="20px" pr="40px" fontSize="sm">
        <AlertDescription>
          {hasError === 'server'
            ? 'We couldn’t sign you in because of a server problem. Please try again shortly.'
            : 'That email and password don’t match an account. Check them and try again.'}
        </AlertDescription>
        <CloseButton
          size="sm"
          position="absolute"
          right="8px"
          top="8px"
          aria-label="Dismiss"
          onClick={() => setErrorState(false)}
        />
      </Alert>
    );
  };

  return (
    <AuthLayout
      title="Log in to Tessera"
      description="Welcome back. Enter your email and password.">
      {showLoginError()}
      <form onSubmit={loginUser}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            size="lg"
            fontSize="md"
            value={values.email}
            placeholder="you@company.com"
            onChange={handleChange}
            autoComplete="email"
          />
        </FormControl>
        <FormControl id="password" mt="20px">
          <FormLabel>Password</FormLabel>
          <PasswordInput
            name="password"
            size="lg"
            fontSize="md"
            value={values.password}
            autoComplete="current-password"
            onChange={handleChange}
          />
        </FormControl>
        <Button
          type="submit"
          width="full"
          mt="28px"
          size="lg"
          fontSize="md"
          colorScheme="brand"
          isLoading={isFetching}
          loadingText="Logging in">
          Log in
        </Button>
      </form>
      <Text mt="24px" fontSize="sm" color="muted">
        New to Tessera?{' '}
        <NextLink href="/signup" passHref>
          <Text as="a" color="lapis" fontWeight={600} _hover={{ textDecoration: 'underline' }}>
            Create an account
          </Text>
        </NextLink>
      </Text>
    </AuthLayout>
  );
};

export default Login;
