import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { Ticket, User, Camera, Upload, X, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimeBackground } from "@/components/anime-background"
import { toast } from "sonner"

export default function ProfileSection() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    
    const [formData, setFormData] = useState({
        firstName: "Lucas",
        lastName: "Silva",
        email: "lucas.silva@email.com",
        instagram: "@lucas.silva",
    })
    
    const [avatar, setAvatar] = useState<string>("/young-brazilian-man-smiling.jpg")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Nome e obrigatorio"
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Sobrenome e obrigatorio"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error("formulario inválido")
            return
        }

        setIsLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            toast.success("Suas informacoes foram salvas com sucesso.")
        } catch (error) {
            toast.error("Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileChange = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Por favor, selecione uma imagem.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("A imagem deve ter no maximo 5MB.")
            return
        }

        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch("http://localhost:5002/api/upload-avatar", {
            method: "POST",
            body: formData,
        });


        if (!res.ok) {
            throw new Error("Upload failed");
        }
        const result = await res.json();
        setAvatar(result.url);
    }

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            handleFileChange(files[0])
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileChange(files[0])
        }
    }

    const removeAvatar = () => {
        setAvatar("")
        toast.info("Sua foto foi removida.")
    }

    return (
        <div className="min-h-screen max-h-screen overflow-y-auto relative py-8">
        <AnimeBackground />

        <div className="absolute inset-0 -z-10 fixed">
            <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
        </div>

        <div className="w-full max-w-lg mx-auto px-4 relative z-10">
            {/* Voltar */}
            <div className="mb-6">
            <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                // onClick={() => router.back()}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
            </Button>
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex items-center gap-2 mb-4">
                <Ticket className="w-10 h-10 text-primary animate-glow" />
                <span className="text-2xl font-bold tracking-tight">
                Chacara<span className="text-primary">Meets</span>
                </span>
            </Link>
            <div className="flex items-center gap-2 mb-2">
                <User className="w-6 h-6 text-accent" />
                <h1 className="text-xl font-semibold">Meu Perfil</h1>
            </div>
            <p className="text-muted-foreground text-center">
                Gerencie suas informacoes pessoais
            </p>
            </div>

            {/* Perfil Card */}
            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center space-y-4">
                <Label className="text-center">Foto de Perfil</Label>
                
                <div
                    className={`relative group cursor-pointer ${isDragging ? "scale-105" : ""} transition-transform duration-200`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div
                    className={`w-32 h-32 rounded-full border-4 ${
                        isDragging 
                        ? "border-accent border-dashed bg-accent/20" 
                        : "border-border/50 group-hover:border-primary/50"
                    } transition-all duration-300 overflow-hidden flex items-center justify-center bg-background/50`}
                    >
                    {avatar ? (
                        <img
                        src={avatar || "/placeholder.svg"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-16 h-16 text-muted-foreground" />
                    )}
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                    </div>

                    {/* Remove button */}
                    {avatar && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            removeAvatar()
                        }}
                        className="absolute -top-1 -right-1 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive/80"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                />

                {/* Drop zone hint */}
                <div className={`flex items-center gap-2 text-sm ${isDragging ? "text-accent" : "text-muted-foreground"} transition-colors`}>
                    <Upload className="w-4 h-4" />
                    <span>Arraste uma imagem ou clique para selecionar</span>
                </div>
                <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 5MB.</p>
                </div>

                <div className="border-t border-border/50" />

                {/* Nome e Sobrenome */}
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="firstName"
                        type="text"
                        placeholder="Seu nome"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`bg-background/50 pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                    />
                    </div>
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                        id="lastName"
                        type="text"
                        placeholder="Seu sobrenome"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`bg-background/50 ${errors.lastName ? "border-destructive" : ""}`}
                    />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        readOnly
                        className="bg-background/30 pl-10 text-muted-foreground cursor-not-allowed"
                    />
                </div>
                <p className="text-xs text-muted-foreground">O e-mail nao pode ser alterado</p>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    disabled={isLoading}
                >
                    {isLoading ? "Salvando..." : "Salvar Alteracoes"}
                </Button>
            </form>

            {/* Links extras */}
            <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
                <Link
                    to="/alterar-senha"
                    className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors group"
                >
                    <span className="text-sm">Alterar senha</span>
                    <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
            </div>
            </div>
        </div>
        </div>
    )
}
