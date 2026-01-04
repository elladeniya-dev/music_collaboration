/**
 * Get user ID from user object (handles both _id and id)
 * @param {object} user - The user object
 * @returns {string|null} User ID
 */
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user._id || null;
};

/**
 * Get user display name
 * @param {object} user - The user object
 * @returns {string} Display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  return user.name || user.username || user.email || 'Unknown User';
};

/**
 * Check if user is the owner of a resource
 * @param {object} user - The current user
 * @param {string} resourceUserId - The resource owner's user ID
 * @returns {boolean} True if user is owner
 */
export const isResourceOwner = (user, resourceUserId) => {
  if (!user || !resourceUserId) return false;
  const userId = getUserId(user);
  return userId === resourceUserId;
};
