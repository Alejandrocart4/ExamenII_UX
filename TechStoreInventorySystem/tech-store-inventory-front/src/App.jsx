import { useEffect, useState } from 'react';
import { createCategory, createProduct, getCategories, getProducts } from './helpers/api';

const emptyProduct = {
  name: '',
  price: '',
  stock: '',
  categoryId: ''
};

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [productForm, setProductForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function formatPrice(value) {
    return Number(value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  function stockStatus(stock) {
    if (stock === 0) {
      return 'agotado';
    }

    if (stock <= 5) {
      return 'bajo';
    }

    return '';
  }

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
    return data;
  }

  async function loadProducts(categoryId = '') {
    const data = await getProducts(categoryId);
    setProducts(data);
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        setLoading(true);
        const categoryData = await loadCategories();
        await loadProducts();

        if (categoryData.length > 0) {
          setProductForm((current) => ({
            ...current,
            categoryId: categoryData[0].id
          }));
        }
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  async function handleCategorySubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const created = await createCategory({ name: categoryName });
      const updatedCategories = await loadCategories();
      setCategoryName('');
      setMessage(`Categoria creada: ${created.name}`);

      if (!productForm.categoryId && updatedCategories.length > 0) {
        setProductForm((current) => ({
          ...current,
          categoryId: updatedCategories[0].id
        }));
      }
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock)
      };

      const created = await createProduct(payload);
      await loadProducts(selectedCategoryId);
      setProductForm((current) => ({
        ...emptyProduct,
        categoryId: current.categoryId
      }));
      setMessage(`Producto creado: ${created.name}`);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function handleFilterChange(event) {
    const categoryId = event.target.value;
    setSelectedCategoryId(categoryId);
    setError('');
    setMessage('');

    try {
      await loadProducts(categoryId);
    } catch (filterError) {
      setError(filterError.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Tech Store — Sistema de Gestion de Inventario</h1>
          <p>Modulo de inventario · Gestion de categorias y productos</p>
        </div>
        <a className="docs-button" href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">
          Documentacion API
        </a>
      </header>

      <main className="content-grid">
        <section className="card">
          <div className="section-heading">
            <h2>CREAR CATEGORIA</h2>
          </div>
          <form onSubmit={handleCategorySubmit} className="form-layout">
            <label>
              NOMBRE
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Ej. Laptops"
              />
            </label>
            <button type="submit" className="dark-button">Registrar categoria</button>
          </form>

          <div className="category-list">
            <p>CATEGORIAS REGISTRADAS</p>
            <div className="pill-row">
              {categories.map((category, index) => (
                <span key={category.id} className="pill">
                  #{index + 1} {category.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <h2>CREAR PRODUCTO</h2>
          </div>
          <form onSubmit={handleProductSubmit} className="form-layout">
            <label>
              NOMBRE
              <input
                value={productForm.name}
                onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                placeholder="Ej. iPhone 15 Pro"
              />
            </label>
            <div className="inline-fields">
              <label>
                PRECIO
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
                  placeholder="0.00"
                />
              </label>
              <label>
                EXISTENCIAS
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.stock}
                  onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
                  placeholder="0"
                />
              </label>
            </div>
            <label>
              CATEGORIA
              <select
                value={productForm.categoryId}
                onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })}
              >
                <option value="">Seleccionar categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="primary-button" disabled={!categories.length}>
              Registrar producto
            </button>
          </form>
        </section>

        <section className="card card-wide">
          <div className="table-header">
            <div>
              <div className="section-heading">
                <h2>PRODUCTOS</h2>
              </div>
              <p className="results-copy">{loading ? 'Cargando datos...' : `${products.length} resultados`}</p>
            </div>
            <div className="filters-wrap">
              <span>Filtrar:</span>
              <div className="pill-row">
                <button
                  type="button"
                  className={selectedCategoryId === '' ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => handleFilterChange({ target: { value: '' } })}
                >
                  Todas
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={selectedCategoryId === category.id ? 'filter-pill active' : 'filter-pill'}
                    onClick={() => handleFilterChange({ target: { value: category.id } })}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {message ? <p className="feedback success">{message}</p> : null}
          {error ? <p className="feedback error">{error}</p> : null}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOMBRE</th>
                  <th>CATEGORIA</th>
                  <th>PRECIO</th>
                  <th>STOCK</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td className="product-name">{product.name}</td>
                      <td>
                        <span className="table-pill">{product.category?.name || 'Sin categoria'}</span>
                      </td>
                      <td>{formatPrice(product.price)}</td>
                      <td className="stock-cell">
                        <strong>{product.stock}</strong>
                        {stockStatus(product.stock) ? (
                          <span className={`stock-tag ${stockStatus(product.stock)}`}>
                            {stockStatus(product.stock)}
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No hay productos para mostrar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
