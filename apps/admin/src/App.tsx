import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminUsers from './page/Users';
import Header from './components/Header/Header';
import { usePageStore } from '@/store/page';
import Meetings from './page/Meetings';
import { Toaster } from 'sonner';

function App() {
    const queryClient = new QueryClient();
    const page = usePageStore((state) => state.page);

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <Header />
            {page === 'users' ? <AdminUsers /> : <Meetings />}
        </QueryClientProvider>
    );
}

export default App;
