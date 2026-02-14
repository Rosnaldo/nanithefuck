import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    id?: string;
}

export function Span({ children, className, id }: React.PropsWithChildren<Props>) {
    return (
        <button
            id={id}
            className={cn(
                className,
                "font-roboto"
            )}
        >
            {children}
        </button>
    )
}
