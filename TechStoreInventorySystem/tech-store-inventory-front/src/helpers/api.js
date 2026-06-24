const API_URL = 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error de red');
  }

  return data;
}

export function getCategories() {
  return request('/categories');
}

export function getProducts(categoryId) {
  const query = categoryId ? `?categoryId=${categoryId}` : '';
  return request(`/products${query}`);
}

export function createCategory(payload) {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function createProduct(payload) {
  return request('/product', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
