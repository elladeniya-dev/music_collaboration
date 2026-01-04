import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jobPostService } from '../services';
import applicationService from '../services/applicationService';
import ApplicationModal from '../components/ApplicationModal';
import { useUser } from '../context/UserContext';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await jobPostService.getJobPostById(id);
        setJob(data);
        checkApplication();
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const checkApplication = async () => {
    if (!user) return;
    
    setCheckingApplication(true);
    try {
      const response = await applicationService.hasUserApplied(id);
      setHasApplied(response.data || false);
    } catch (err) {
      console.error('Error checking application:', err);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">Job not found.</div>
      </div>
    );
  }

  const isOwner = user?.id === job.userId;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Header Image */}
          {job.imageUrl && (
            <div className="h-64 overflow-hidden">
              <img
                src={job.imageUrl}
                alt={job.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Title and Status */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-3">{job.title}</h1>
                <div className="flex items-center gap-3 text-gray-400">
                  <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                  {job.closed && (
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                      Closed
                    </span>
                  )}
                </div>
              </div>
              
              {/* Apply Button */}
              {!isOwner && user && !job.closed && (
                <button
                  onClick={() => setShowApplicationModal(true)}
                  disabled={hasApplied || checkingApplication}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    hasApplied
                      ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  }`}
                >
                  {hasApplied ? '✓ Applied' : 'Apply Now'}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-gray-400 text-sm">Views</div>
                <div className="text-white text-2xl font-bold">{job.viewCount || 0}</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-gray-400 text-sm">Applications</div>
                <div className="text-white text-2xl font-bold">{job.applicationCount || 0}</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-gray-400 text-sm">Type</div>
                <div className="text-white text-lg font-medium capitalize">
                  {job.jobType?.replace('_', ' ') || job.collaborationType}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {/* Skills Required */}
            {(job.requiredSkills?.length > 0 || job.skillsNeeded) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  )) || job.skillsNeeded?.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Skills */}
            {job.preferredSkills?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Preferred Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.preferredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Genres */}
            {job.genres?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {job.genres.map((genre, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {job.isPaid !== undefined && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Compensation</div>
                  <div className="text-white font-medium">
                    {job.isPaid ? `Paid${job.budgetRange ? ` - ${job.budgetRange}` : ''}` : 'Unpaid'}
                  </div>
                </div>
              )}

              {job.deadline && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Deadline</div>
                  <div className="text-white font-medium">
                    {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>
              )}

              {job.estimatedDuration && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Duration</div>
                  <div className="text-white font-medium">{job.estimatedDuration}</div>
                </div>
              )}

              {job.visibility && (
                <div>
                  <div className="text-gray-400 text-sm mb-1">Visibility</div>
                  <div className="text-white font-medium capitalize">
                    {job.visibility.replace('_', ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        jobPost={job}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSuccess={handleApplicationSuccess}
      />
    </div>
  );
};

export default JobDetails;
