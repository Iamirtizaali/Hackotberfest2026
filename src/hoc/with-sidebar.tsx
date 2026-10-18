import React, { Component } from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from '@/src/components/app-shell/sidebar';
import AiPlanner from '@/src/components/ai-planner';

const withSidebar = (App, props) => {
  return class BoardWithSidebar extends Component {
    constructor(props) {
      super(props);
    }

    static async getInitialProps(ctx) {
      let appProps = {};

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      return {
        ...appProps
      };
    }

    render() {
      const { page } = props;

      return (
        <Box
          minHeight="100vh"
          bg="plaster"
          display="flex"
          flexDirection={['column', 'column', 'row']}>
          <Sidebar page={page} />
          <Box
            as="main"
            flex="1"
            minWidth="0"
            px={['16px', '24px', '48px']}
            py={['24px', '32px', '48px']}>
            <Box maxW="1080px" mx="auto">
              <Box
                display="flex"
                justifyContent="flex-end"
                mt={['-8px', '-16px', '-28px']}
                mb="8px">
                <AiPlanner />
              </Box>
              <App />
            </Box>
          </Box>
        </Box>
      );
    }
  };
};

export default withSidebar;
