/**
 * Reusable loading skeleton components for all pages
 */

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
}

// Student card skeleton
export function StudentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-48 rounded" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <Skeleton className="h-9 w-20 rounded" />
        <Skeleton className="h-9 w-20 rounded" />
        <Skeleton className="h-9 w-24 rounded" />
      </div>
    </div>
  );
}

// Teacher card skeleton
export function TeacherCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-40 rounded mb-2" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <Skeleton className="h-9 w-20 rounded" />
        <Skeleton className="h-9 w-24 rounded" />
      </div>
    </div>
  );
}

// Attendance table skeleton
export function AttendanceTableSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32 rounded" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-24" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-5 w-40" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-16 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Schedule grid skeleton
export function ScheduleGridSkeleton() {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-700">
        {days.map((day) => (
          <div key={day} className="min-h-[200px] p-4">
            <Skeleton className="h-6 w-20 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// List skeleton for virtualized lists
export function ListSkeleton({ count = 10, height = 80 }: { count?: number; height?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Skeleton className={`h-12 w-12 rounded-full`} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-11 w-full rounded" />
      </div>
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-11 w-full rounded" />
      </div>
      <div>
        <Skeleton className="h-5 w-28 mb-2" />
        <Skeleton className="h-24 w-full rounded" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-11 w-24 rounded" />
        <Skeleton className="h-11 w-20 rounded" />
      </div>
    </div>
  );
}

// Dashboard stats skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// Dashboard grid skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <ListSkeleton count={5} height={60} />
        </div>
        <div>
          <Skeleton className="h-6 w-40 mb-4" />
          <AttendanceTableSkeleton />
        </div>
      </div>
    </div>
  );
}
