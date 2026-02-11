import { useState, useEffect } from 'react';
import { assignmentAPI } from '../../services/api';
import { Assignment } from '../../types';
import toast from 'react-hot-toast';

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await assignmentAPI.getAll();
      setAssignments(res.data.assignments || []);
    } catch (err) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    try {
      const res = await assignmentAPI.updateStatus(id, { status });
      if (res.data.message?.includes('success')) {
        toast.success(`Assignment marked as ${status}`);
        fetchAssignments();
      } else {
        toast.error(res.data.message || 'Failed to update');
      }
    } catch (err) {
      toast.error('Failed to update assignment');
    }
  };

  const filtered = statusFilter === 'ALL' ? assignments : assignments.filter((a) => a.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Assignments</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View and manage staff shift assignments ({assignments.length} total)
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              statusFilter === tab
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {tab} {tab !== 'ALL' ? `(${assignments.filter((a) => a.status === tab).length})` : `(${assignments.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No assignments found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => {
            const staffName = typeof a.assignedTo === 'object' ? a.assignedTo.name : 'Unknown';
            const staffEmail = typeof a.assignedTo === 'object' ? a.assignedTo.email : '';
            return (
              <div key={a._id} className="card-hover">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
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

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{staffName.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{staffName}</span>
                      <span className="text-xs text-gray-400">{staffEmail}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {a.shift && (
                        <>
                          <span>📅 {new Date(a.shift.date).toLocaleDateString()}</span>
                          <span>🕐 {a.shift.startTime} - {a.shift.endTime}</span>
                        </>
                      )}
                      <span>✅ Assigned: {new Date(a.assignedOn).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {a.status === 'ACTIVE' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'COMPLETED')}
                        className="btn-success text-sm py-2 px-3"
                      >
                        ✅ Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(a._id, 'CANCELLED')}
                        className="btn-danger text-sm py-2 px-3"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
