import { useState, useRef } from "react"
import { X, Play } from "lucide-react"

const media = [
    { type: "image", src: "/assets/anime-style-pool-party-friends-summer-japanese.jpg", span: "col-span-2 row-span-2" },
    { type: "video", src: "/assets/pool-party-clip-1.jpg", span: "col-span-1 row-span-1" },
    { type: "image", src: "/assets/anime-style-bbq-grill-meat-japanese-illustration.jpg", span: "col-span-1 row-span-1" },
    { type: "video", src: "/assets/bbq-party-clip.jpg", span: "col-span-1 row-span-1" },
    { type: "image", src: "/assets/anime-style-friends-talking-sunset-japanese.jpg", span: "col-span-1 row-span-1" },
    { type: "image", src: "/assets/anime-style-cocktails-drinks-bar-japanese.jpg", span: "col-span-1 row-span-1" },
    { type: "video", src: "/assets/dj-party-clip.jpg", span: "col-span-1 row-span-1" },
    { type: "image", src: "/assets/anime-style-night-party-lights-japanese.jpg", span: "col-span-2 row-span-1" },
]

function VideoThumbnail({ src, onClick }: { src: string; onClick: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isHovering, setIsHovering] = useState(false)

    return (
        <div
        className="relative w-full h-full cursor-pointer group"
        onMouseEnter={() => {
            setIsHovering(true)
            videoRef.current?.play()
        }}
        onMouseLeave={() => {
            setIsHovering(false)
            videoRef.current?.pause()
            if (videoRef.current) videoRef.current.currentTime = 0
        }}
        onClick={onClick}
        >
        <video ref={videoRef} src={src} className="w-full h-full object-cover" muted loop playsInline poster={src} />
        {/* Play icon overlay */}
        <div
            className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
        >
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground ml-1" fill="currentColor" />
            </div>
        </div>
        {/* Video badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-xs font-medium">Vídeo</div>
        </div>
    )
    }

    export function GallerySection() {
    const [selectedMedia, setSelectedMedia] = useState<{ type: string; src: string } | null>(null)

    return (
        <section id="galeria" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
                Galeria
            </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {media.map((item, index) => (
                <div key={index} className={`${item.span} relative rounded-xl overflow-hidden group`}>
                {item.type === "video" ? (
                    <VideoThumbnail src={item.src} onClick={() => setSelectedMedia(item)} />
                ) : (
                    <div className="w-full h-full cursor-pointer" onClick={() => setSelectedMedia(item)}>
                    <img
                        src={item.src || "/placeholder.svg"}
                        alt={`Galeria ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                )}

                {/* Anime-style corner decoration */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            ))}
            </div>
        </div>

        {/* Lightbox */}
        {selectedMedia && (
            <div
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
            >
            <button
                className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                onClick={() => setSelectedMedia(null)}
            >
                <X className="w-6 h-6" />
            </button>
            {selectedMedia.type === "video" ? (
                <video
                src={selectedMedia.src}
                className="max-w-full max-h-[90vh] rounded-xl"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <img
                src={selectedMedia.src || "/placeholder.svg"}
                alt="Imagem ampliada"
                className="max-w-full max-h-[90vh] rounded-xl object-contain"
                />
            )}
            </div>
        )}
        </section>
    )
}
