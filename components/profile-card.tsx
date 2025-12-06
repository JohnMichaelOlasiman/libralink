import { Card } from "@/components/ui/card"
import { CheckCircle, QrCode } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/db"

interface ProfileCardProps {
  user: User & { year_level?: string; course?: string }
}

export function ProfileCard({ user }: ProfileCardProps) {
  const hasAvatar = user.avatar_url && !user.avatar_url.includes("placeholder") && !user.avatar_url.includes("portrait")

  return (
    <div className="space-y-6">
      {/* Profile Info Card - Modern card layout matching admin design */}
      <Card className="glass-card border-border overflow-hidden">
        {/* Cover Photo */}
        <div className="h-24 bg-gradient-to-r from-accent/30 via-primary/20 to-secondary relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <Avatar className="w-24 h-24 border-4 border-card">
              {hasAvatar ? <AvatarImage src={user.avatar_url! || "/placeholder.svg"} /> : null}
              <AvatarFallback className="bg-secondary text-foreground text-2xl">
                {user.full_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-16 pb-6 px-6 text-center">
          {/* Verified Badge */}
          {user.email_verified && (
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500 fill-green-500" />
              <span className="text-xs text-green-500 font-medium">Verified Student</span>
            </div>
          )}

          <h2 className="text-xl font-bold text-foreground mb-1">{user.full_name}</h2>
          <p className="text-sm text-muted-foreground mb-6">{user.email}</p>

          <div className="space-y-4 text-left">
            {(user as any).year_level && (
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Year Level</span>
                <span className="text-sm font-medium text-foreground">{(user as any).year_level}</span>
              </div>
            )}
            {(user as any).course && (
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Course</span>
                <span className="text-sm font-medium text-foreground">{(user as any).course}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Student ID</span>
              <span className="text-sm font-medium text-foreground">{user.university_id || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Department</span>
              <span className="text-sm font-medium text-foreground">{user.department || "Not specified"}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Digital ID Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-0 overflow-hidden p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-sm font-bold">L</span>
          </div>
          <span className="text-white font-semibold">{user.university_name || "LibraLink University"}</span>
        </div>

        <p className="text-blue-200 text-xs text-center italic mb-4">Empowering Dreams, Inspiring Futures</p>

        <div className="flex gap-4">
          {/* Profile Photo */}
          <div className="w-24 h-28 bg-gradient-to-b from-secondary to-muted rounded-lg flex items-center justify-center overflow-hidden">
            {hasAvatar ? (
              <img src={user.avatar_url! || "/placeholder.svg"} alt="ID Photo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-foreground text-2xl font-bold">{user.full_name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>

          {/* ID Details */}
          <div className="flex-1 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-200">Student ID</span>
              <span className="text-white font-mono">{user.university_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Full Name</span>
              <span className="text-white">{user.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Year Level</span>
              <span className="text-white">{(user as any).year_level || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Course</span>
              <span className="text-white truncate max-w-[100px]">{(user as any).course || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Contact</span>
              <span className="text-white truncate max-w-[100px]">{user.phone || user.email}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="w-16 flex flex-col items-center justify-end">
            <div className="w-14 h-14 bg-white rounded p-1">
              <QrCode className="w-full h-full text-blue-800" />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-500/50 flex justify-between text-[10px] text-blue-200">
          <span>University No: +1 (800) 456-7890</span>
          <span>Website: www.libralink.edu</span>
        </div>
      </Card>
    </div>
  )
}
