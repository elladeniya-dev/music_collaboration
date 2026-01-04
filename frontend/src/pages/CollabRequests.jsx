import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip,
  Tooltip, IconButton, Box, Grid
} from '@mui/material';
import { Edit, Send, Add, Delete } from '@mui/icons-material';
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
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" sx={{ color: '#3f51b5', fontWeight: 'bold', mb: 4 }}>
        Public Collaboration Requests
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Collaboration Request
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {requests.length === 0 ? (
            <Typography textAlign="center" color="textSecondary" width="100%">
              No collaboration requests found.
            </Typography>
          ) : (
            requests.map((req) => {
              const isCreator = req.creatorId === getUserId(user);
              return (
                <Grid item xs={12} key={req.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          {req.title}
                        </Typography>
                        {isCreator && <Chip label="You" color="primary" size="small" />}
                      </Box>

                      <Typography variant="body2" color="textSecondary" mt={0.5}>
                        Posted by: {req.creatorEmail || req.creatorId}
                      </Typography>

                      <Typography variant="body1" mt={1.5}>
                        {req.description}
                      </Typography>

                      <Box display="flex" gap={1} mt={2}>
                        {!isCreator && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<Send />}
                            onClick={() => handleAccept(req.id)}
                          >
                            Apply
                          </Button>
                        )}
                        {isCreator && (
                          <>
                            <Tooltip title="Edit this request">
                              <IconButton color="info" onClick={() => handleEdit(req)}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete this request">
                              <IconButton color="error" onClick={() => handleDelete(req.id)}>
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Update Request' : 'Create Request'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollabRequests;
