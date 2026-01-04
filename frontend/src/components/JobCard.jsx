import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { formatDate, parseSkills, truncateText, getUserId, isResourceOwner } from '../utils';

const JobCard = ({ job, onDelete, onUpdate }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const isOwner = isResourceOwner(user, job.userId);

  const handleClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(job.id);
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    onUpdate(job);
  };

  const formattedDate = formatDate(job.availability);
  const skills = parseSkills(job.skillsNeeded);

  return (
    <div
      onClick={handleClick}
      className="group bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col"
    >
      {/* Image */}
      {job.imageUrl && (
        <div className="h-48 overflow-hidden bg-slate-100">
          <img
            src={job.imageUrl}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {job.title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 flex-1">
          {truncateText(job.description, 100)}
        </p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="space-y-1 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{job.collaborationType}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Available: {formattedDate}</span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-2 pt-4 border-t border-slate-200">
            <button
              onClick={handleUpdate}
              className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
