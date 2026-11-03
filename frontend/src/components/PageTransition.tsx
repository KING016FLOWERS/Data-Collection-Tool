import type { PropsWithChildren } from "react";

export function PageTransition({ children }: PropsWithChildren) {
  return <div className="page-enter">{children}</div>;
}
