import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { shiftAPI, shiftRequestAPI, assignmentAPI } from '../../services/api';
import { Shift, ShiftRequest, Assignment } from '../../types';
import StatCard from '../../components/StatCard';
import { HiCalendar, HiClipboardList, HiCheckCircle, HiClock, HiUserGroup, HiTrendingUp } from 'react-icons/hi';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ShiftRequest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shiftRes, reqRes, assignRes] = await Promise.all([
          shiftAPI.getAll(),
          shiftRequestAPI.getPending(),
          assignmentAPI.getAll(),
        ]);
        setShifts(shiftRes.data.shifts || []);
        setPendingRequests(reqRes.data.requests || []);
        setAssignments(assignRes.data.assignments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const availableShifts = shifts.filter((s) => s.status === 'AVAILABLE');
  const assignedShifts = shifts.filter((s) => s.status === 'ASSIGNED');
  const activeAssignments = assignments.filter((a) => a.status === 'ACTIVE');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manager Dashboard <span className="text-gradient">{user?.name}</span> 🎯
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of shifts, requests, and assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Shifts" value={shifts.length} icon={<HiCalendar className="w-5 h-5" />} color="blue" />
        <StatCard title="Available" value={availableShifts.length} icon={<HiTrendingUp className="w-5 h-5" />} color="green" />
        <StatCard title="Assigned" value={assignedShifts.length} icon={<HiCheckCircle className="w-5 h-5" />} color="purple" />
        <StatCard title="Pending Requests" value={pendingRequests.length} icon={<HiClock className="w-5 h-5" />} color="amber" />
        <StatCard title="Assignments" value={assignments.length} icon={<HiClipboardList className="w-5 h-5" />} color="blue" />
        <StatCard title="Active Staff" value={activeAssignments.length} icon={<HiUserGroup className="w-5 h-5" />} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pending Requests</h2>
            {pendingRequests.length > 0 && (
              <span className="badge-pending">{pendingRequests.length} pending</span>
            )}
          </div>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <HiCheckCircle className="w-12 h-12 text-emerald-300 dark:text-emerald-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">All caught up! No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map((r) => {
                const staffName = typeof r.requestedBy === 'object' ? r.requestedBy.name : 'Unknown';
                return (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{r.shift?.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        By: {staffName} • {r.shift ? new Date(r.shift.date).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <span className="badge-pending">PENDING</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Assignments</h2>
          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <HiClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No assignments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((a) => {
                const staffName = typeof a.assignedTo === 'object' ? a.assignedTo.name : 'Unknown';
                return (
                  <div key={a._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{a.shift?.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Staff: {staffName} • {a.shift ? new Date(a.shift.date).toLocaleDateString() : ''}
                      </p>
                    </div>
                    <span className={
                      a.status === 'ACTIVE' ? 'badge-active' :
                      a.status === 'COMPLETED' ? 'badge-completed' : 'badge-cancelled'
                    }>
                      {a.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
