import { useState, useEffect } from 'react';
import { shiftAPI, shiftRequestAPI } from '../../services/api';
import { Shift } from '../../types';
import ShiftCard from '../../components/ShiftCard';
import toast from 'react-hot-toast';

export default function AvailableShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [reasonModal, setReasonModal] = useState<{ open: boolean; shiftId: string }>({ open: false, shiftId: '' });
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await shiftAPI.getAvailable();
      setShifts(res.data.shifts || []);
    } catch (err) {
      toast.error('Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!reasonModal.shiftId) return;
    setRequestingId(reasonModal.shiftId);
    try {
      const res = await shiftRequestAPI.create({ shiftId: reasonModal.shiftId, reason });
      if (res.data.shiftRequest) {
        toast.success('Shift requested successfully!');
        setReasonModal({ open: false, shiftId: '' });
        setReason('');
        fetchShifts(); // Refresh list
      } else {
        toast.error(res.data.message || 'Failed to request shift');
      }
    } catch (err) {
      toast.error('Failed to request shift');
    } finally {
      setRequestingId(null);
    }
  };

  const filteredShifts = shifts.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDate = dateFilter ? new Date(s.date).toISOString().split('T')[0] === dateFilter : true;
    return matchSearch && matchDate;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Shifts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse and request open shifts</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search shifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field !py-2 !px-3 text-sm"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field !py-2 !px-3 text-sm"
          />
        </div>
      </div>

      {filteredShifts.length === 0 ? (
        <div className="card text-center py-16">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No available shifts</h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1">Check back later for new shifts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShifts.map((shift) => (
            <ShiftCard
              key={shift._id}
              shift={shift}
              actionLabel={requestingId === shift._id ? 'Requesting...' : 'Request Shift'}
              onAction={() => setReasonModal({ open: true, shiftId: shift._id })}
              actionColor="primary"
            />
          ))}
        </div>
      )}

      {/* Reason Modal */}
      {reasonModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card w-full max-w-md animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Request Shift</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add a reason for your request (optional)
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you want this shift? (optional)"
              className="input-field min-h-[100px] resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setReasonModal({ open: false, shiftId: '' }); setReason(''); }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                disabled={requestingId !== null}
                className="btn-primary text-sm disabled:opacity-60"
              >
                {requestingId ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
