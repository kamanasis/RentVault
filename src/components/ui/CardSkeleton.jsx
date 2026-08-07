import React from 'react';
import { Card } from '../cards/Card';
import { Skeleton } from './Skeleton';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="space-y-4 border border-border/60">
          <div className="flex justify-between items-center">
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-20 h-6" />
          </div>

          <div className="space-y-2">
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-1/2 h-4" />
          </div>

          <div className="p-3 bg-background/50 rounded-2xl space-y-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-border/40">
            <Skeleton className="w-20 h-8" />
            <Skeleton className="w-28 h-9" />
          </div>
        </Card>
      ))}
    </div>
  );
};
