import axios from 'axios';
 
// Base API client — points to Spring Boot backend
const api = axios.create({
  baseURL: 'http://localhost:8080/api/calculator',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
});
 
/**
 * Sends a calculation request to the backend.
 * @param {number} operand1
 * @param {number} operand2
 * @param {string} operator  - one of: "+", "-", "*", "/", "%"
 * @returns {Promise<CalculationResponse>}
 */
export const calculate = async (operand1, operand2, operator) => {
  const response = await api.post('/calculate', { operand1, operand2, operator });
  return response.data;
};
 
/**
 * Fetches the full calculation history from the backend.
 * @returns {Promise<HistoryEntry[]>}
 */
export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};
 
/**
 * Clears all history entries on the backend.
 */
export const clearHistory = async () => {
  const response = await api.delete('/history');
  return response.data;
};
 
export default api;