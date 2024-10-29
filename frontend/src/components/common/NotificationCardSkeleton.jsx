import React from "react";

const NotificationCardSkeleton = () => {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex items-center">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="ml-4 flex-1">
          {/* Sender and audience skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          {/* Body skeleton */}
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          {/* Date skeleton */}
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCardSkeleton;
