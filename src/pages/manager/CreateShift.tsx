import { useState } from 'react';
import { shiftAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CreateShift() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !startTime || !endTime) {
      toast.error('Please fill in all fields');
      return;
    }
    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }
    setSubmitting(true);
    try {
      const res = await shiftAPI.create({ title, date, startTime, endTime });
      if (res.data.shift) {
        toast.success('Shift created successfully!');
        navigate('/manager/all-shifts');
      } else {
        toast.error(res.data.message || 'Failed to create shift');
      }
    } catch (err) {
      toast.error('Failed to create shift');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick templates
  const templates = [
    { label: 'Morning Shift', start: '06:00', end: '14:00' },
    { label: 'Afternoon Shift', start: '14:00', end: '22:00' },
    { label: 'Night Shift', start: '22:00', end: '06:00' },
    { label: 'Half Day AM', start: '08:00', end: '12:00' },
    { label: 'Half Day PM', start: '13:00', end: '17:00' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Shift</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Set up a new work shift for staff to request</p>
      </div>

      {/* Quick Templates */}
      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Quick Templates
        </h3>
        <div className="flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.label}
              onClick={() => {
                setTitle(t.label);
                setStartTime(t.start);
                setEndTime(t.end);
              }}
              className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
            >
              {t.label} ({t.start} - {t.end})
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Shift Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Shift, Weekend Coverage"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Preview */}
          {title && date && startTime && endTime && (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-900/30">
              <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">Shift Preview</h4>
              <p className="text-gray-900 dark:text-white font-bold">{title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📅 {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🕐 {startTime} — {endTime}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                '✨ Create Shift'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/manager/all-shifts')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
