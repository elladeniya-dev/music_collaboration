// Collaboration Status Enum (aligned with backend)
export const CollaborationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
};

// Collaboration Types
export const CollaborationType = {
  REMOTE: 'Remote',
  IN_PERSON: 'In-Person',
  HYBRID: 'Hybrid',
};

// Message Status Enum (aligned with backend)
export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
};

// Message Type
export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
};

// User Type Enum (aligned with backend)
export const UserType = {
  MUSICIAN: 'MUSICIAN',
  PRODUCER: 'PRODUCER',
  ENGINEER: 'ENGINEER',
  OTHER: 'OTHER',
};
