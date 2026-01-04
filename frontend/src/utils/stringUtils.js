/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param {string} str - The string to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Parse comma-separated skills into array
 * @param {string} skillsString - Comma-separated skills
 * @returns {Array<string>} Array of trimmed skills
 */
export const parseSkills = (skillsString) => {
  if (!skillsString) return [];
  return skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
};

/**
 * Join array of skills into comma-separated string
 * @param {Array<string>} skillsArray - Array of skills
 * @returns {string} Comma-separated skills
 */
export const joinSkills = (skillsArray) => {
  if (!Array.isArray(skillsArray)) return '';
  return skillsArray.filter(Boolean).join(', ');
};
