import React, { FC, useState } from 'react';
import { Button, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react';

// A password field with a show/hide toggle, so people can check what they typed
const PasswordInput: FC<InputProps> = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputGroup size={props.size}>
      <Input {...props} type={isVisible ? 'text' : 'password'} pr="72px" />
      <InputRightElement width="68px" height="100%">
        <Button
          size="xs"
          variant="ghost"
          color="muted"
          fontSize="13px"
          height="28px"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
