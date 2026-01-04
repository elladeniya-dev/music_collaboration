import { useState } from 'react';

/**
 * Custom hook to handle form state
 * @param {object} initialValues - Initial form values
 * @returns {object} { values, handleChange, handleSubmit, reset, setValues }
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (callback) => async (e) => {
    e.preventDefault();
    if (callback) {
      await callback(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
  };

  return {
    values,
    handleChange,
    handleSubmit,
    reset,
    setValues,
  };
};
