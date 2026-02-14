import { Header } from "@/components/header"
import { AnimeBackground } from "@/components/anime-background"
import ProfileSection from "@/components/profile-section"

export default function ProfilePage() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <AnimeBackground />
            <Header />
            <ProfileSection />
        </main>
    )
}
