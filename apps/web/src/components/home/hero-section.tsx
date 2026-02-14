import { useEffect, useRef } from "react"
import { Users, MapPin, Calendar } from "lucide-react"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        autoPlay
        poster="/pool-party-churrasco-summer-friends-anime-style.jpg"
      >
        <source
          src="https://assets.mixkit.co/videos/40105/40105-720.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle overlay - only at bottom 20% for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95" />

      {/* Content - occupying bottom 20% */}
      <div className="relative z-10 w-full h-[30vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Chacara Weekend <span className="text-primary">Edition Summer</span>
          </h1>

          {/* Event info tags */}
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-primary" />
              <span>18-19 Jan 2026</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Chacara Vista Verde, SP</span>
            </div>
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 text-primary" />
              <span>50-80 pessoas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
