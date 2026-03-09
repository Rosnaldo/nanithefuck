import { Spinner } from "@/components/ui/spinner"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/meeting/chacara-meets')
    }, [])

    return (
        <main className="relative min-h-screen overflow-hidden">
            <Spinner />
            Loading...
        </main>
    )
}
