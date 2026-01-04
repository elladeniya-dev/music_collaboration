import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Chip } from '@mui/material';
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

  const skillChips = parseSkills(job.skillsNeeded).map((skill) => (
    <Chip key={skill} label={skill} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
  ));

  return (
    <Card
      onClick={handleClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.01)' },
      }}
    >
      {job.imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={job.imageUrl}
          alt={job.title}
        />
      )}

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {truncateText(job.description, 100)}
        </Typography>

        <Box mt={1}>{skillChips}</Box>

        <Typography variant="body2" mt={1}>
          <strong>Type:</strong> {job.collaborationType}
        </Typography>
        <Typography variant="body2">
          <strong>Available:</strong> {formattedDate}
        </Typography>

        {isOwner && (
          <Box mt={2} display="flex" gap={1}>
            <Button size="small" variant="outlined" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
