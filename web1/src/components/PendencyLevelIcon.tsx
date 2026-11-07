import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PendencyLevelIconProps = {
  icon: LucideIcon;
  tone: string;
  pill?: string;
  className?: string;
  iconClassName?: string;
  showPill?: boolean;
};

export function PendencyLevelIcon({
  icon: Icon,
  tone,
  pill,
  className,
  iconClassName,
  showPill = false,
}: PendencyLevelIconProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      <span
        className={cn(
          "inline-flex h-fit w-fit items-center justify-center rounded-full p-[5px] text-[11px] font-bold shadow-elegant",
          tone,
        )}
      >
        <Icon className={cn("h-4 w-4 border-none", iconClassName)} />
      </span>
      {showPill && pill ? (
        <span
          className={cn(
            "absolute -top-2 -right-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[8.5px] font-bold opacity-100",
            tone,
          )}
        >
          {pill}
        </span>
      ) : null}
    </div>
  );
}
