import React, { Component } from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from '@/src/components/app-shell/sidebar';
import { AiPlannerProvider } from '@/src/components/ai-planner';

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
        <AiPlannerProvider>
          <Box
            minHeight="100vh"
            bg="marble"
            display="flex"
            flexDirection={['column', 'column', 'column', 'row']}>
            <Sidebar page={page} />
            {/* Pages sit on a white sheet; the marble around it is the app's frame */}
            <Box
              as="main"
              id="main"
              flex="1"
              minWidth="0"
              bg="surface"
              m={['0', '0', '0', '8px 8px 8px 0']}
              borderRadius={['0', '0', '0', 'sheet']}
              border={['none', 'none', 'none', '1px solid']}
              borderColor="line"
              px={['16px', '24px', '40px', '48px']}
              py={['24px', '32px', '40px', '44px']}>
              <Box maxW="1120px" mx="auto">
                <App />
              </Box>
            </Box>
          </Box>
        </AiPlannerProvider>
      );
    }
  };
};

export default withSidebar;
