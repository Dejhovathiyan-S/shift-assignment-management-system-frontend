import { useState, useEffect } from 'react';
import { shiftRequestAPI } from '../../services/api';
import { ShiftRequest } from '../../types';
import toast from 'react-hot-toast';

export default function MyRequests() {
  const [requests, setRequests] = useState<ShiftRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await shiftRequestAPI.getMyRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    try {
      const res = await shiftRequestAPI.cancel(id);
      if (res.data.message?.includes('success')) {
        toast.success('Request cancelled');
        fetchRequests();
      } else {
        toast.error(res.data.message || 'Failed to cancel');
      }
    } catch (err) {
      toast.error('Failed to cancel request');
    }
  };

  const filtered = activeTab === 'ALL' ? requests : requests.filter((r) => r.status === activeTab);

  const tabs = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Requests</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your shift request statuses</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {tab} {tab !== 'ALL' ? `(${requests.filter((r) => r.status === tab).length})` : `(${requests.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No requests found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div key={req._id} className="card-hover">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {req.shift?.title || 'Unknown Shift'}
                    </h3>
                    <span className={
                      req.status === 'PENDING' ? 'badge-pending' :
                      req.status === 'APPROVED' ? 'badge-approved' : 'badge-rejected'
                    }>
                      {req.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {req.shift && (
                      <>
                        <span>📅 {new Date(req.shift.date).toLocaleDateString()}</span>
                        <span>🕐 {req.shift.startTime} - {req.shift.endTime}</span>
                      </>
                    )}
                    <span>📝 Requested: {new Date(req.requestedOn).toLocaleDateString()}</span>
                  </div>
                  {req.reason && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Your reason:</span> {req.reason}
                    </p>
                  )}
                  {req.rejectionReason && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      <span className="font-semibold">Rejection reason:</span> {req.rejectionReason}
                    </p>
                  )}
                </div>
                {req.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(req._id)}
                    className="btn-danger text-sm py-2 px-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
