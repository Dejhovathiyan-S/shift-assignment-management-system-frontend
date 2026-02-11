import { useState, useEffect } from 'react';
import { shiftAPI } from '../../services/api';
import { Shift } from '../../types';
import ShiftCard from '../../components/ShiftCard';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AllShifts() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'ASSIGNED'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const res = await shiftAPI.getAll();
      setShifts(res.data.shifts || []);
    } catch (err) {
      toast.error('Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shift?')) return;
    try {
      const res = await shiftAPI.delete(id);
      if (res.data.message?.includes('success')) {
        toast.success('Shift deleted');
        fetchShifts();
      } else {
        toast.error(res.data.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Failed to delete shift');
    }
  };

  const filtered = shifts.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchSearch && matchStatus;
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Shifts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all work shifts</p>
        </div>
        <button onClick={() => navigate('/manager/create-shift')} className="btn-primary">
          + Create Shift
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search shifts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field !py-2 sm:max-w-xs"
        />
        <div className="flex gap-2">
          {(['ALL', 'AVAILABLE', 'ASSIGNED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No shifts found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((shift) => (
            <ShiftCard key={shift._id} shift={shift}>
              <button
                onClick={() => handleDelete(shift._id)}
                className="btn-danger text-sm py-2 px-4"
              >
                Delete
              </button>
            </ShiftCard>
          ))}
        </div>
      )}
    </div>
  );
}
