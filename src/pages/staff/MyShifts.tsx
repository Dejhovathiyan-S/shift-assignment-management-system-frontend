import { useState, useEffect } from 'react';
import { assignmentAPI } from '../../services/api';
import { Assignment } from '../../types';
import toast from 'react-hot-toast';

export default function MyShifts() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await assignmentAPI.getMyAssignments();
      setAssignments(res.data.assignments || []);
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Group by date for calendar view
  const groupedByDate = assignments.reduce((acc, a) => {
    if (!a.shift) return acc;
    const date = new Date(a.shift.date).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(a);
    return acc;
  }, {} as Record<string, Assignment[]>);

  const sortedDates = Object.keys(groupedByDate).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Shifts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your confirmed shift assignments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            📋 List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              viewMode === 'calendar' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            📅 Timeline
          </button>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No shifts assigned yet</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1">Request a shift to get started</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {assignments.map((a) => (
            <div key={a._id} className="card-hover">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {a.shift?.title || 'Unknown Shift'}
                    </h3>
                    <span className={
                      a.status === 'ACTIVE' ? 'badge-active' :
                      a.status === 'COMPLETED' ? 'badge-completed' : 'badge-cancelled'
                    }>
                      {a.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {a.shift && (
                      <>
                        <span>📅 {formatDate(a.shift.date)}</span>
                        <span>🕐 {a.shift.startTime} - {a.shift.endTime}</span>
                      </>
                    )}
                    <span>✅ Assigned: {new Date(a.assignedOn).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Timeline View */
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-primary-500 rounded-full" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatDate(date)}
                </h3>
              </div>
              <div className="ml-6 border-l-2 border-primary-200 dark:border-primary-800 pl-6 space-y-3">
                {groupedByDate[date].map((a) => (
                  <div key={a._id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{a.shift?.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {a.shift?.startTime} - {a.shift?.endTime}
                        </p>
                      </div>
                      <span className={
                        a.status === 'ACTIVE' ? 'badge-active' :
                        a.status === 'COMPLETED' ? 'badge-completed' : 'badge-cancelled'
                      }>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
