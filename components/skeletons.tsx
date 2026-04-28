import React from 'react';

export const KPICardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-6 rounded-xl bg-[var(--bg2)] border border-white/5">
        <div className="skeleton-shimmer h-10 w-20 rounded-md mb-4" />
        <div className="skeleton-shimmer h-4 w-32 rounded-md" />
      </div>
    ))}
  </div>
);

export const VehicleTableSkeleton = () => (
  <div className="w-full bg-[var(--bg2)] rounded-xl border border-white/5 overflow-hidden">
    <div className="p-4 border-b border-white/5 flex gap-4">
      <div className="skeleton-shimmer h-6 w-24 rounded-md" />
      <div className="skeleton-shimmer h-6 w-24 rounded-md" />
    </div>
    <div className="p-4 space-y-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="skeleton-shimmer h-10 w-10 rounded-full shrink-0" style={{ animationDelay: `${i * 100}ms` }} />
          <div className="flex-1 space-y-2">
            <div className="skeleton-shimmer h-4 w-32 rounded-md" style={{ animationDelay: `${i * 100}ms` }} />
            <div className="skeleton-shimmer h-3 w-24 rounded-md" style={{ animationDelay: `${i * 100}ms` }} />
          </div>
          <div className="skeleton-shimmer h-4 w-48 rounded-md hidden md:block" style={{ animationDelay: `${i * 100}ms` }} />
          <div className="skeleton-shimmer h-6 w-20 rounded-full shrink-0" style={{ animationDelay: `${i * 100}ms` }} />
        </div>
      ))}
    </div>
  </div>
);

export const SidebarSkeleton = () => (
  <div className="w-[200px] h-screen fixed left-0 top-0 bg-[var(--bg2)] border-r border-white/5 p-4 flex flex-col gap-6">
    <div className="skeleton-shimmer h-8 w-32 rounded-md mb-8" />
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="skeleton-shimmer h-5 w-5 rounded-sm shrink-0" />
        <div className="skeleton-shimmer h-4 w-24 rounded-md" />
      </div>
    ))}
    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-white/5">
      <div className="skeleton-shimmer h-10 w-10 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="skeleton-shimmer h-3 w-full rounded-md" />
        <div className="skeleton-shimmer h-2 w-2/3 rounded-md" />
      </div>
    </div>
  </div>
);

export const DashboardPageSkeleton = () => (
  <div className="min-h-screen bg-[var(--bg)] flex">
    <SidebarSkeleton />
    <div className="ml-[200px] flex-1 p-8 space-y-6">
      <div className="skeleton-shimmer h-10 w-64 rounded-md mb-8" />
      <KPICardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6">
          <VehicleTableSkeleton />
        </div>
        <div className="lg:col-span-4 bg-[var(--bg2)] rounded-xl border border-white/5 p-6">
           <div className="skeleton-shimmer h-6 w-32 rounded-md mb-6" />
           <div className="space-y-6">
             {[1,2,3,4].map(i => (
               <div key={i} className="flex gap-4">
                 <div className="skeleton-shimmer h-full w-1 rounded-full" />
                 <div className="space-y-2 flex-1">
                   <div className="skeleton-shimmer h-4 w-full rounded-md" />
                   <div className="skeleton-shimmer h-3 w-20 rounded-md" />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  </div>
);

export const DriverCardSkeleton = () => (
  <div className="p-6 rounded-xl bg-[var(--bg2)] border border-white/5 flex flex-col gap-4 w-64">
    <div className="flex items-center gap-4">
      <div className="skeleton-shimmer h-12 w-12 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="skeleton-shimmer h-4 w-24 rounded-md" />
        <div className="skeleton-shimmer h-3 w-16 rounded-md" />
      </div>
    </div>
    <div className="skeleton-shimmer h-2 w-full rounded-full mt-2" />
    <div className="skeleton-shimmer h-6 w-20 rounded-full mt-2" />
  </div>
);
