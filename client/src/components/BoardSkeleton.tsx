'use client';

const SkeletonCard = () => (
  <div className="p-4 border rounded-lg shadow-sm bg-gray-200 h-24">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
  </div>
);

export default function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-100 p-4 rounded-lg">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      ))}
    </div>
  );
}
