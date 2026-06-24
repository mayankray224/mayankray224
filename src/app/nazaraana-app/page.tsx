"use client";

import LandingClient from "@/components/LandingClient";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHydration } from "@/hooks/useHydration";
import { PageSkeleton } from "@/components/shared/SkeletonLoader";

export default function NazaraanaLanding() {
  const store = useStore();
  const router = useRouter();
  const hydrated = useHydration();

  useEffect(() => {
    if (hydrated && store.isAuthenticated) {
      if (store.onboardingCompleted) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [hydrated, store.isAuthenticated, store.onboardingCompleted, router]);

  if (!hydrated) {
    return <PageSkeleton />;
  }

  return <LandingClient />;
}
