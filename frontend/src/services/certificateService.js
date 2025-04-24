import axios from 'axios';

const API_URL = 'http://localhost:5000/api/certificates';

/**
 * Upload a certificate file with metadata
 * @param {string} userId - The user ID
 * @param {FormData} formData - The form data containing the certificate file and metadata
 * @returns {Promise} - The upload response
 */
export const uploadCertificate = async (userId, formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Send the request with the form data that already contains file and metadata
    const response = await axios.post(
      `${API_URL}/${userId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading certificate:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a certificate file URL
 * @param {string} userId - The user ID
 * @param {string} certificateId - The certificate ID
 * @returns {string} - The certificate file URL
 */
export const getCertificateUrl = (userId, certificateId) => {
  const token = localStorage.getItem('token');
  return `${API_URL}/${userId}/${certificateId}?token=${token}`;
};

/**
 * Delete a certificate
 * @param {string} userId - The user ID
 * @param {string} certificateId - The certificate ID
 * @returns {Promise} - The delete response
 */
export const deleteCertificate = async (userId, certificateId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await axios.delete(
      `${API_URL}/${userId}/${certificateId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error deleting certificate:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  uploadCertificate,
  getCertificateUrl,
  deleteCertificate
}; 