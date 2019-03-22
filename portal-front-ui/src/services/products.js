import request from '../utils/request';

export async function getAllProducts() {
  return request('/api/products/getAll');
}
