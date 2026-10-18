import Home from '@/src/components/home';
import withSidebar from '@/src/hoc/with-sidebar';
import withStore from '@/src/hoc/with-store';
import withAuth from '@/src/hoc/with-auth';
import withBoardsLayout from '@/src/hoc/with-boards-layout';

const HomePageWithSidebar = withSidebar(Home, { page: 'home' });
const HomePageWithAuth = withAuth(HomePageWithSidebar);
const HomePageWithLayout = withBoardsLayout(HomePageWithAuth);
const HomePageWithStore = withStore(HomePageWithLayout);

export default HomePageWithStore;
