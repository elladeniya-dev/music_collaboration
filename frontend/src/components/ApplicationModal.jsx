import { useState } from 'react';
import applicationService from '../services/applicationService';

const ApplicationModal = ({ jobPost, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedRate: '',
    portfolioUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await applicationService.submitApplication({
        jobPostId: jobPost.id,
        coverLetter: formData.coverLetter,
        proposedRate: formData.proposedRate ? parseFloat(formData.proposedRate) : null,
        portfolioUrl: formData.portfolioUrl || null,
      });

      onSuccess?.();
      onClose();
      setFormData({ coverLetter: '', proposedRate: '', portfolioUrl: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Apply to Job</h2>
            <p className="text-gray-400 text-sm mt-1">{jobPost?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              rows={6}
              required
              placeholder="Tell them why you're the perfect fit for this collaboration..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-gray-500 text-xs mt-1">
              {formData.coverLetter.length}/1000 characters
            </p>
          </div>

          {/* Proposed Rate */}
          {jobPost?.isPaid && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proposed Rate {jobPost.budgetRange && `(Budget: ${jobPost.budgetRange})`}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={formData.proposedRate}
                  onChange={(e) => setFormData({ ...formData, proposedRate: e.target.value })}
                  placeholder="500"
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Optional: Specify your rate or leave blank
              </p>
            </div>
          )}

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Portfolio / Work Samples URL
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://soundcloud.com/yourwork"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-gray-500 text-xs mt-1">
              Share a link to your SoundCloud, Spotify, YouTube, or personal website
            </p>
          </div>

          {/* Job Details Summary */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h3 className="text-white font-medium mb-3">Job Summary</h3>
            <div className="space-y-2 text-sm">
              {jobPost?.jobType && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{jobPost.jobType.replace('_', ' ')}</span>
                </div>
              )}
              {jobPost?.isPaid !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Compensation:</span>
                  <span className="text-white">{jobPost.isPaid ? 'Paid' : 'Unpaid'}</span>
                </div>
              )}
              {jobPost?.deadline && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline:</span>
                  <span className="text-white">{new Date(jobPost.deadline).toLocaleDateString()}</span>
                </div>
              )}
              {jobPost?.estimatedDuration && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{jobPost.estimatedDuration}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.coverLetter}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
