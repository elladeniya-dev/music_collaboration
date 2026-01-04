import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { collaborationService } from '../services';
import { showSuccess, showError, showConfirmation } from '../utils';
import { getUserId } from '../utils';

const CollabRequests = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchRequests = async () => {
    try {
      const data = await collaborationService.getAllCollaborationRequests();
      setRequests(data);
    } catch (err) {
      console.error('❌ Failed to fetch collaboration requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await collaborationService.acceptCollaborationRequest(requestId);
      showSuccess('Accepted!', 'Collaboration request accepted and message sent.');
      fetchRequests();
    } catch (err) {
      showError('Error', 'Could not accept request.');
      console.error(err);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const confirmed = await showConfirmation(
        'Are you sure?',
        'This will permanently delete the request.'
      );

      if (confirmed) {
        await collaborationService.deleteCollaborationRequest(requestId);
        showSuccess('Deleted!', 'Your request has been deleted.');
        fetchRequests();
      }
    } catch (err) {
      showError('Error', 'Could not delete request.');
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        await collaborationService.updateCollaborationRequest(editingId, { title, description });
        showSuccess('Updated!', 'Collaboration request updated.');
      } else {
        await collaborationService.createCollaborationRequest({ title, description });
        showSuccess('Created!', 'Collaboration request created.');
      }
      handleClose();
      fetchRequests();
    } catch (err) {
      showError('Error', 'Could not save request.');
      console.error(err);
    }
  };

  const handleEdit = (req) => {
    setEditingId(req.id);
    setTitle(req.title);
    setDescription(req.description);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-center text-white mb-8">
        Collaboration Requests
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Request
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
              <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-slate-400">No collaboration requests found.</p>
            </div>
          ) : (
            requests.map((req) => {
              const isCreator = req.creatorId === getUserId(user);
              return (
                <div key={req.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-indigo-600 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {req.title}
                    </h3>
                    {isCreator && (
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded border border-indigo-500/30">
                        Your Post
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-400 mb-4">
                    Posted by: {req.creatorEmail || req.creatorId}
                  </p>

                  <p className="text-slate-300 leading-relaxed mb-4">
                    {req.description}
                  </p>

                  <div className="flex gap-2">
                    {!isCreator && (
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Apply
                      </button>
                    )}
                    {isCreator && (
                      <>
                        <button
                          onClick={() => handleEdit(req)}
                          className="p-2 text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingId ? 'Update Request' : 'Create Request'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Enter description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollabRequests;
