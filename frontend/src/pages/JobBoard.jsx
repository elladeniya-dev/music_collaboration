import React, { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import { useNavigate } from 'react-router-dom';
import { jobPostService } from '../services';
import { showSuccess, showError } from '../utils';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    jobPostService.getAllJobPosts()
      .then((data) => {
        // Handle both array and wrapped response
        const jobList = Array.isArray(data) ? data : (data?.content || data?.data || []);
        setJobs(jobList);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setError('There was an error fetching job posts. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (jobId) => {
    try {
      await jobPostService.deleteJobPost(jobId);
      showSuccess('Job post deleted successfully');
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      showError('Error deleting the job post');
    }
  };

  const handleUpdate = (job) => {
    navigate(`/job/${job.id}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Opportunities</h1>
        <p className="text-slate-600">Discover music collaboration projects and gigs</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm">Loading opportunities...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg py-16 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No opportunities yet</h3>
          <p className="text-slate-500 text-sm">Check back soon for new collaborations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onDelete={handleDelete} 
              onUpdate={handleUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
