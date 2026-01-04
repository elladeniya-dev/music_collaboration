import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import applicationService from '../services/applicationService';

const Applications = () => {
  const { user, loadingUser } = useUser();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('submitted');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    // Only fetch applications after user context is loaded
    if (!loadingUser) {
      fetchApplications();
    }
  }, [activeTab, loadingUser]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Fetching ${activeTab} applications...`);
      
      const data = activeTab === 'submitted'
        ? await applicationService.getMyApplications()
        : await applicationService.getReceivedApplications();
      
      console.log(`✅ Received ${activeTab} applications:`, data);
      setApplications(data);
    } catch (err) {
      console.error('❌ Error fetching applications:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load applications';
      setError(errorMsg);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await applicationService.withdrawApplication(applicationId);
      fetchApplications();
    } catch (err) {
      console.error('Error withdrawing application:', err);
      alert(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const handleStatusChange = (application) => {
    setSelectedApp(application);
    setNewStatus(application.status);
    setRejectionReason('');
    setShowStatusModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp || !newStatus) return;

    try {
      setUpdatingStatus(true);
      await applicationService.updateApplicationStatus(
        selectedApp.id,
        newStatus,
        newStatus === 'REJECTED' ? rejectionReason : undefined
      );
      setShowStatusModal(false);
      fetchApplications();
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      UNDER_REVIEW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      SHORTLISTED: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      ACCEPTED: 'bg-green-500/20 text-green-300 border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
      WITHDRAWN: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[status] || statusColors.PENDING}`}>
        {status?.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
          <p className="text-gray-400">Manage your job applications</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'submitted'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'received'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Received Applications
          </button>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
            <p className="text-gray-400">
              {activeTab === 'submitted'
                ? "You haven't applied to any jobs yet"
                : "You haven't received any applications yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-bold text-white mb-2 cursor-pointer hover:text-purple-400"
                      onClick={() => navigate(`/jobs/${app.jobPostId || app.jobPost?.id}`)}
                    >
                      {app.jobPost?.title || 'Job Post'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                      {app.updatedAt && app.appliedAt !== app.updatedAt && (
                        <span>Updated: {new Date(app.updatedAt).toLocaleDateString()}</span>
                      )}
                      {activeTab === 'received' && app.applicant && (
                        <span className="text-purple-400">
                          From: {app.applicant.name || app.applicant.email}
                        </span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                {/* Cover Letter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Cover Letter</h4>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {app.coverLetter}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {app.proposedRate && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Proposed Rate</div>
                      <div className="text-white font-medium">${app.proposedRate}</div>
                    </div>
                  )}
                  {app.portfolioUrl && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Portfolio</div>
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm break-all"
                      >
                        View Portfolio
                      </a>
                    </div>
                  )}
                  {app.jobPost?.isPaid !== undefined && (
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Job Type</div>
                      <div className="text-white">{app.jobPost.isPaid ? 'Paid' : 'Unpaid'}</div>
                    </div>
                  )}
                </div>

                {/* Rejection Reason */}
                {app.status === 'REJECTED' && app.rejectionReason && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-red-400 mb-2">Rejection Reason</h4>
                    <p className="text-gray-300 text-sm">{app.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {activeTab === 'submitted' && app.status === 'PENDING' && (
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
                    >
                      Withdraw
                    </button>
                  )}

                  {activeTab === 'received' && 
                    ['PENDING', 'UNDER_REVIEW', 'SHORTLISTED'].includes(app.status) && (
                    <button
                      onClick={() => handleStatusChange(app)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm"
                    >
                      Update Status
                    </button>
                  )}

                  {activeTab === 'received' && app.applicant && (
                    <button
                      onClick={() => navigate(`/profile/${app.applicant.id}`)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all text-sm"
                    >
                      View Profile
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Update Application Status</h2>

            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {newStatus === 'REJECTED' && (
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                  placeholder="Provide feedback to the applicant..."
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                {updatingStatus ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
