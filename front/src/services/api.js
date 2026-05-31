import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3334/v1',
  withCredentials: true,
});

export function getApiError(error, fallback = 'Não foi possível concluir a operação.') {
  const data = error?.response?.data;

  if (typeof data === 'string') return data;
  if (data?.msg) return data.msg;
  if (data?.mensagem) return data.mensagem;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  return fallback;
}
