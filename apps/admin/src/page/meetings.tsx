import { Header } from '@/components/header';
import { MeetingsTable } from '@/components/meetings-table';

export default function AdminUsers() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Header />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <MeetingsTable />
            </div>
        </div>
    );
}