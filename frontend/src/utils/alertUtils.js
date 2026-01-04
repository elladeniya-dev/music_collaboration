import Swal from 'sweetalert2';

/**
 * Show success alert
 * @param {string} title - Alert title
 * @param {string} text - Alert text
 */
export const showSuccess = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK',
  });
};

/**
 * Show error alert
 * @param {string} title - Alert title
 * @param {string} text - Alert text
 */
export const showError = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK',
  });
};

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} text - Dialog text
 * @returns {Promise<boolean>} True if confirmed
 */
export const showConfirmation = async (title, text = '') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });
  return result.isConfirmed;
};

/**
 * Show input dialog
 * @param {string} title - Dialog title
 * @param {string} inputLabel - Input label
 * @param {string} inputType - Input type (text, email, etc.)
 * @param {string} placeholder - Input placeholder
 * @returns {Promise<string|null>} Input value or null if cancelled
 */
export const showInputDialog = async (title, inputLabel = '', inputType = 'text', placeholder = '') => {
  const result = await Swal.fire({
    title,
    input: inputType,
    inputLabel,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: 'Submit',
  });
  return result.isConfirmed ? result.value : null;
};

/**
 * Show loading indicator
 * @param {string} title - Loading title
 */
export const showLoading = (title = 'Loading...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Close any open alert
 */
export const closeAlert = () => {
  Swal.close();
};
