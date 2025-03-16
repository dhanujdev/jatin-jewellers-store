"use client";

import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Preserve existing classes while adding antialiased during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    const existingClasses = document.body.className.split(' ').filter(c => c && c !== 'antialiased');
    document.body.className = [...existingClasses, 'antialiased'].join(' ').trim();
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      {children}
    </body>
  );
}