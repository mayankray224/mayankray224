import React from "react";

export function CardSkeleton() {
  return (
    <div className="bg-[#FFFDFB] dark:bg-dark-card border border-warm-border dark:border-dark-border p-6 rounded-3xl space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-warm-bg dark:bg-dark-bg w-1/3 rounded-lg" />
        <div className="h-5 bg-warm-bg dark:bg-dark-bg w-8 rounded-full" />
      </div>
      <div className="flex items-center gap-4 py-2">
        <div className="w-16 h-16 rounded-full bg-warm-bg dark:bg-dark-bg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-warm-bg dark:bg-dark-bg w-3/4 rounded-lg" />
          <div className="h-3 bg-warm-bg dark:bg-dark-bg w-1/2 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-warm-bg dark:bg-dark-bg p-4 md:p-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-warm-border/40 dark:bg-dark-border/40 w-1/4 rounded-xl animate-pulse" />
        <div className="h-4 bg-warm-border/40 dark:bg-dark-border/40 w-1/2 rounded-xl animate-pulse" />
      </div>
      <GridSkeleton />
      <div className="h-48 bg-warm-border/40 dark:bg-dark-border/40 w-full rounded-3xl animate-pulse" />
    </div>
  );
}
