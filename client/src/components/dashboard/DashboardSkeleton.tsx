import React from 'react';
import { Card } from '../ui/Card';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0" />
          <div className="space-y-2 w-48">
            <div className="h-5 bg-neutral-200 rounded w-full" />
            <div className="h-3 bg-neutral-100 rounded w-3/4" />
          </div>
        </div>
        <div className="h-9 bg-neutral-200 rounded-lg w-32 shrink-0" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-neutral-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
              <div className="h-5 bg-neutral-200 rounded w-3/4" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="h-64 bg-white border-neutral-200 flex flex-col justify-between">
          <div className="h-4 bg-neutral-200 rounded w-1/3" />
          <div className="h-16 bg-neutral-100 rounded w-full" />
          <div className="h-4 bg-neutral-200 rounded w-1/2" />
        </Card>
        <Card className="lg:col-span-2 h-64 bg-white border-neutral-200 space-y-4">
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
          <div className="h-32 bg-neutral-100 rounded w-full" />
        </Card>
      </div>
    </div>
  );
};

