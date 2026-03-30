import { Suspense } from "react";

import { LoginPageClient } from "@/components/LoginPageClient";

export default function LoginPage() {
  return (
    <main className="container page-space">
      <Suspense fallback={null}>
        <LoginPageClient />
      </Suspense>
    </main>
  );
}
