import axios from 'axios';
import { Quote } from '../types';

const baseURL =
  import.meta.env.VITE_REACT_API_BASE_URL || 'http://localhost:3000/api';

export async function getQuotesApi(
  count: number,
  tag?: string
): Promise<Quote[]> {
  const url = `${baseURL}/quotes`;
  const params = { count, tag };
  const response = await axios.get<Quote[]>(url, { params });
  return response.data;
}
