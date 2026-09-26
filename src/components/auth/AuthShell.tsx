import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuthShellProps {
  badge: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  wide?: boolean;
}

export function AuthShell({
  badge,
  title,
  description,
  children,
  wide = false,
}: AuthShellProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="pointer-events-none absolute inset-0 grid-pattern" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-nexora/8 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full bg-nexora/5 blur-3xl" />

      <div className="section-container relative py-12 md:py-16">
        <div className={wide ? "mx-auto w-full max-w-2xl" : "mx-auto w-full max-w-lg"}>
          <Badge variant="nexora" className="mb-4 w-fit gap-1.5 px-3 py-1">
            <Zap className="size-3" />
            {badge}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
