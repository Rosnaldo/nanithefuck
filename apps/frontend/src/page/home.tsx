import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { GallerySection } from "@/components/home/gallery-section"
import { TicketSection } from "@/components/home/ticket-section"
import { ScheduleSection } from "@/components/home/schedule-section"
import { ParticipantListSection } from "@/components/home/participant-list-section"
import { LocationSection } from "@/components/home/location-section"
import { FooterSection } from "@/components/footer-section"
import { Header } from "@/components/header"
import { AnimeBackground } from "@/components/anime-background"

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            <AnimeBackground />
            <Header />
            <HeroSection />
            <FeaturesSection />
            <GallerySection />
            <ScheduleSection />
            <TicketSection />
            <ParticipantListSection />
            <LocationSection />
            <FooterSection />
        </main>
    )
}
