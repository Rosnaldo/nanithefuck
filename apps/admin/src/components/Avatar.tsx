import { cn } from '@/lib/utils';
import { UserUtils, type IUser } from '@repo/shared-types';

const userUtils = new UserUtils();

type AvatarProps = {
    user?: IUser;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
} as const;

export const avatarColors = [
    'bg-indigo-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-violet-500',
    'bg-cyan-500',
] as const;

export function Avatar({
    user,
    size = 'md',
    className,
}: AvatarProps) {
    const bgColor = userUtils.getAvatarColor(avatarColors, user);

    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center font-medium text-white select-none',
                sizeMap[size],
                bgColor,
                className
            )}
            aria-label={userUtils.getFullname(user)}
        >
            {userUtils.getInitials(user)}
        </div>
    );
}
