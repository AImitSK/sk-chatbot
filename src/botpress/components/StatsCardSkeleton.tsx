import React from 'react';

const StatsCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          {/* Title */}
          <dt className="relative">
            <div className="h-4 w-32 rounded bg-gray-200 animate-skeleton" />
          </dt>
          
          {/* Value */}
          <dd className="relative mt-1">
            <div className="h-9 w-20 rounded bg-gray-200 animate-skeleton" />
          </dd>
        </div>
      ))}
    </div>
  );
};

export default StatsCardSkeleton;