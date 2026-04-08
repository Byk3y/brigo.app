"use client";

import { useEffect } from "react";

export default function InviteRedirect({ code }: { code: string }) {
  useEffect(() => {
    // Silently attempt to open the app via custom URL scheme.
    // If the app is installed, it opens. If not, nothing visible happens.
    window.location.href = `brigo://invite/${code}`;
  }, [code]);

  return null;
}
