import { Book } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageStore } from '@/store/page';

export default function Header() {
    const page = usePageStore((state) => state.page);
    const setPage = usePageStore((state) => state.setPage);

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 sm:pt-12">
                <div className="flex justify-end items-center justify-end gap-2 ">
                    <Book className="w-4 h-4 text-slate-500" />
                    <Select value={page} onValueChange={setPage}>
                        <SelectTrigger className="w-40 h-11 rounded-xl border-slate-200">
                            <SelectValue placeholder="Função" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-100">
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="meetings">Meetings</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
