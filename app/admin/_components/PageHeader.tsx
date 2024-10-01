import React from "react";

export function PageHeader({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <h1 className="text-4xl mb-4 antialiased">{children}</h1>;
}
