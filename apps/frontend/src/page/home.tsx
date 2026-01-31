import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { GallerySection } from "@/components/gallery-section"
import { TicketSection } from "@/components/ticket-section"
import { ScheduleSection } from "@/components/schedule-section"
import { GuestListSection } from "@/components/guest-list-section"
import { LocationSection } from "@/components/location-section"
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
            <GuestListSection />
            <LocationSection />
            <FooterSection />
        </main>
    )
}
