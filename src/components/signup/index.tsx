import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Text,
  useToast,
  Alert,
  AlertDescription,
  CloseButton
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';
import shortId from 'shortid';
import checkEnvironment from '@/util/check-environment';
import { useRouter } from 'next/router';
import AuthLayout from '@/src/components/auth-layout';
import PasswordInput from '@/src/components/auth-layout/password-input';

const SignUp = (): JSX.Element => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [isCreating, setIsCreatingStatus] = useState(false);
  const [hasError, setErrorState] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
  const validPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');

  const validate = (nextValues) => {
    setEmailErr(!!nextValues.email && !validEmail.test(nextValues.email));
    setPasswordErr(!!nextValues.password && !validPassword.test(nextValues.password));
  };

  const showToast = () => {
    toast({
      position: 'top',
      title: 'Account created',
      description: 'Taking you to the log in page.',
      status: 'success',
      duration: 2500,
      isClosable: true
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (isButtonDisabled()) return;

    setIsCreatingStatus(true);

    const id = shortId.generate();
    const host = checkEnvironment();

    const { email, password, confirmPassword, fullName } = values;

    const data = {
      id,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      fullName: fullName
    };

    const url = `${host}/api/register`;

    const response = await fetch(url, {
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

    const result = await response.json();
    setIsCreatingStatus(false);

    if (response.status === 404) {
      setErrorState(true);
    }

    const { email: inviteEmail, token, boardId } = router.query;
    const isInvitedUser = inviteEmail && token && boardId;

    if (isInvitedUser && result.message === 'success') {
      redirectToLoginPage(`/login?token=${token}&email=${inviteEmail}&boardId=${boardId}`);
    } else {
      if (result.message === 'success') {
        redirectToLoginPage();
      }
    }
  };

  const redirectToLoginPage = (path = '/login') => {
    showToast();

    setTimeout(() => {
      window.location.href = path;
    }, 3000);
  };

  const showSignUpError = () => {
    if (!hasError) return;

    return (
      <Alert status="error" mb="20px" pr="40px" fontSize="sm">
        <AlertDescription>
          An account with this email already exists. Log in instead.
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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValues = {
      ...values,
      [name]: value
    };

    setValues(nextValues);
    validate(nextValues);
  };

  const passwordsDiffer = !!values.confirmPassword && values.password !== values.confirmPassword;

  const isButtonDisabled = () => {
    const isValidPassword = values.password !== values.confirmPassword;
    const isDisabled = !values.email || !values.fullName;

    return isValidPassword || isDisabled || !values.password || !values.confirmPassword;
  };

  const inputProps = { size: 'lg', fontSize: 'md' };

  return (
    <AuthLayout title="Create your account" description="You can invite your team once you're in.">
      {showSignUpError()}
      <form onSubmit={registerUser}>
        <FormControl id="fullName" isRequired>
          <FormLabel>Full name</FormLabel>
          <Input
            {...inputProps}
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            autoComplete="name"
          />
        </FormControl>
        <FormControl id="email" mt="20px" isRequired isInvalid={emailErr}>
          <FormLabel>Email</FormLabel>
          <Input
            {...inputProps}
            type="email"
            name="email"
            value={values.email}
            placeholder="you@company.com"
            onChange={handleChange}
            autoComplete="email"
          />
          <FormErrorMessage>Enter an email address like name@company.com.</FormErrorMessage>
        </FormControl>
        <FormControl id="password" mt="20px" isRequired isInvalid={passwordErr}>
          <FormLabel>Password</FormLabel>
          <PasswordInput
            {...inputProps}
            name="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {passwordErr ? (
            <FormErrorMessage>
              Use at least 6 characters, with a letter and a number.
            </FormErrorMessage>
          ) : (
            <FormHelperText color="muted">
              At least 6 characters, with a letter and a number.
            </FormHelperText>
          )}
        </FormControl>
        <FormControl id="confirmPassword" mt="20px" isRequired isInvalid={passwordsDiffer}>
          <FormLabel>Confirm password</FormLabel>
          <PasswordInput
            {...inputProps}
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <FormErrorMessage>Passwords don&apos;t match.</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          width="full"
          mt="28px"
          size="lg"
          fontSize="md"
          colorScheme="brand"
          isDisabled={isButtonDisabled()}
          isLoading={isCreating}
          loadingText="Creating account">
          Create account
        </Button>
      </form>
      <Text mt="24px" fontSize="sm" color="muted">
        Already have an account?{' '}
        <NextLink href="/login" passHref>
          <Text as="a" color="lapis" fontWeight={600} _hover={{ textDecoration: 'underline' }}>
            Log in
          </Text>
        </NextLink>
      </Text>
    </AuthLayout>
  );
};

export default SignUp;
