import { cn } from "@/lib/utils";
import { getInitials, type IUser, type IUserParticipant } from "@repo/shared-types";

const bgs: string[] = [
  "#dde8f5",
  "#ece8f5",
  "#e8f0e0",
  "#fdf0e8",
  "#f5e8f0",
];

interface IProp {
    user: IUserParticipant | IUser;
    className?: string;
}

export function Avatar({ user, className }: IProp) {
  return (
    <div className={cn("w-[50px] h-[50px] rounded-full mx-auto mb-2 relative overflow-hidden border-2 border-[rgba(160,136,120,0.2)]", className)}>
        {user.avatar?.url ? (
            <img
                src={user.avatar?.url}
                alt={user.firstName}
                className="w-full h-full object-cover"
            />
        ) : (
            <div
                className="w-full h-full flex items-center justify-center text-[1.4rem]"
            >
                {getInitials(user.firstName)}
            </div>
        )}
    </div>
  )
}
