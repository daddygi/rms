// app/dashboard/_components/RecentActivities.tsx
"use client";

import { format } from "date-fns";

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

interface Props {
  activities: RecentActivity[];
}

export function RecentActivities({ activities }: Props) {
  if (activities.length === 0) {
    return <div className="text-gray-500 text-sm">No recent activities.</div>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="p-4 border rounded-lg shadow-sm">
          <div className="text-sm font-semibold">{activity.type}</div>
          <div className="text-gray-600 text-sm">{activity.description}</div>
          <div className="text-gray-400 text-xs mt-1">
            {format(new Date(activity.created_at), "PPPpp")}
          </div>
        </div>
      ))}
    </div>
  );
}
