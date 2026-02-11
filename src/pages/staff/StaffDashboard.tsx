import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { shiftRequestAPI, assignmentAPI, shiftAPI } from '../../services/api';
import { ShiftRequest, Assignment, Shift } from '../../types';
import StatCard from '../../components/StatCard';
import { HiCalendar, HiClipboardList, HiCheckCircle, HiClock } from 'react-icons/hi';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ShiftRequest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, assignRes, shiftRes] = await Promise.all([
          shiftRequestAPI.getMyRequests(),
          assignmentAPI.getMyAssignments(),
          shiftAPI.getAvailable(),
        ]);
        setRequests(reqRes.data.requests || []);
        setAssignments(assignRes.data.assignments || []);
        setAvailableShifts(shiftRes.data.shifts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length;
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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="text-gradient">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your shift overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Available Shifts"
          value={availableShifts.length}
          icon={<HiCalendar className="w-5 h-5" />}
          color="blue"
          subtitle="Open for requests"
        />
        <StatCard
          title="Pending Requests"
          value={pendingCount}
          icon={<HiClock className="w-5 h-5" />}
          color="amber"
          subtitle="Awaiting approval"
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<HiCheckCircle className="w-5 h-5" />}
          color="green"
          subtitle="Requests approved"
        />
        <StatCard
          title="Active Shifts"
          value={activeAssignments.length}
          icon={<HiClipboardList className="w-5 h-5" />}
          color="purple"
          subtitle="Currently assigned"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Upcoming Shifts</h2>
          {activeAssignments.length === 0 ? (
            <div className="text-center py-8">
              <HiCalendar className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No upcoming shifts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAssignments.slice(0, 5).map((a) => (
                <div key={a._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{a.shift?.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {a.shift ? new Date(a.shift.date).toLocaleDateString() : ''} • {a.shift?.startTime} - {a.shift?.endTime}
                    </p>
                  </div>
                  <span className="badge-active">{a.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Requests */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Requests</h2>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <HiClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 5).map((r) => (
                <div key={r._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{r.shift?.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(r.requestedOn).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={
                    r.status === 'PENDING' ? 'badge-pending' :
                    r.status === 'APPROVED' ? 'badge-approved' : 'badge-rejected'
                  }>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
