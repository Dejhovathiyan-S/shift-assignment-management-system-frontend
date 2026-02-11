import { Shift } from '../types';

interface ShiftCardProps {
  shift: Shift;
  actionLabel?: string;
  onAction?: () => void;
  actionColor?: 'primary' | 'danger' | 'success';
  showStatus?: boolean;
  children?: React.ReactNode;
}

export default function ShiftCard({
  shift,
  actionLabel,
  onAction,
  actionColor = 'primary',
  showStatus = true,
  children,
}: ShiftCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const colorMap = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    success: 'btn-success',
  };

  const createdByName = typeof shift.createdBy === 'object' ? shift.createdBy.name : 'Unknown';

  return (
    <div className="card-hover group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {shift.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Created by {createdByName}
          </p>
        </div>
        {showStatus && (
          <span className={shift.status === 'AVAILABLE' ? 'badge-available' : 'badge-assigned'}>
            {shift.status}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{formatDate(shift.date)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg className="w-4 h-4 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {shift.startTime} — {shift.endTime}
            </span>
          </div>
        </div>
      </div>

      {(actionLabel || children) && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
          {actionLabel && onAction && (
            <button onClick={onAction} className={`${colorMap[actionColor]} text-sm py-2 px-4`}>
              {actionLabel}
            </button>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
