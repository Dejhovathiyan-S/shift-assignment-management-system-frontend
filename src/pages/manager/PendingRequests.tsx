import { useState, useEffect } from 'react';
import { shiftRequestAPI } from '../../services/api';
import { ShiftRequest } from '../../types';
import toast from 'react-hot-toast';

export default function PendingRequests() {
  const [requests, setRequests] = useState<ShiftRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string }>({ open: false, id: '' });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await shiftRequestAPI.getPending();
      setRequests(res.data.requests || []);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await shiftRequestAPI.approve(id);
      if (res.data.message?.includes('success')) {
        toast.success('Request approved! Assignment created.');
        fetchRequests();
      } else {
        toast.error(res.data.message || 'Failed to approve');
      }
    } catch (err) {
      toast.error('Failed to approve request');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.id) return;
    setActionId(rejectModal.id);
    try {
      const res = await shiftRequestAPI.reject(rejectModal.id, { rejectionReason });
      if (res.data.message?.includes('rejected')) {
        toast.success('Request rejected');
        setRejectModal({ open: false, id: '' });
        setRejectionReason('');
        fetchRequests();
      } else {
        toast.error(res.data.message || 'Failed to reject');
      }
    } catch (err) {
      toast.error('Failed to reject request');
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pending Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and manage staff shift requests ({requests.length} pending)
          </p>
        </div>
        <button onClick={fetchRequests} className="btn-secondary text-sm">
          🔄 Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-16 h-16 text-emerald-300 dark:text-emerald-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">All caught up!</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1">No pending requests to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const staffName = typeof req.requestedBy === 'object' ? req.requestedBy.name : 'Unknown';
            const staffEmail = typeof req.requestedBy === 'object' ? req.requestedBy.email : '';
            return (
              <div key={req._id} className="card border-l-4 border-l-amber-400">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {req.shift?.title || 'Unknown Shift'}
                      </h3>
                      <span className="badge-pending">PENDING</span>
                    </div>

                    {/* Staff Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{staffName.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{staffName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{staffEmail}</p>
                      </div>
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
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                        <span className="font-semibold">Reason:</span> {req.reason}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(req._id)}
                      disabled={actionId === req._id}
                      className="btn-success text-sm py-2 px-4 disabled:opacity-60"
                    >
                      {actionId === req._id ? '...' : '✅ Approve'}
                    </button>
                    <button
                      onClick={() => setRejectModal({ open: true, id: req._id })}
                      disabled={actionId === req._id}
                      className="btn-danger text-sm py-2 px-4 disabled:opacity-60"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reject Request</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Provide a reason for rejection (optional)
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="input-field min-h-[100px] resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal({ open: false, id: '' }); setRejectionReason(''); }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionId !== null}
                className="btn-danger text-sm disabled:opacity-60"
              >
                {actionId ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
