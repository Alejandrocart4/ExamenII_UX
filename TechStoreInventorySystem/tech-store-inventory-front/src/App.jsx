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
    <div className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Sistema de gestion de inventario</p>
          <h1>Tech Store</h1>
          <p className="subtitle">
            Modulo web para registrar, clasificar y consultar productos tecnologicos por categoria.
          </p>
        </div>
        <a className="docs-link" href="http://localhost:3000/api-docs" target="_blank" rel="noreferrer">
          Ver Swagger
        </a>
      </header>

      <main className="dashboard">
        <section className="panel">
          <h2>Registrar categoria</h2>
          <form onSubmit={handleCategorySubmit} className="form-grid">
            <label>
              Nombre
              <input
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Ej. Laptops"
              />
            </label>
            <button type="submit">Crear categoria</button>
          </form>
        </section>

        <section className="panel">
          <h2>Registrar producto</h2>
          <form onSubmit={handleProductSubmit} className="form-grid">
            <label>
              Nombre
              <input
                value={productForm.name}
                onChange={(event) => setProductForm({ ...productForm, name: event.target.value })}
                placeholder="Ej. Laptop Dell Inspiron"
              />
            </label>
            <label>
              Precio
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                onChange={(event) => setProductForm({ ...productForm, price: event.target.value })}
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                step="1"
                value={productForm.stock}
                onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })}
              />
            </label>
            <label>
              Categoria
              <select
                value={productForm.categoryId}
                onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })}
              >
                <option value="">Seleccione una categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={!categories.length}>
              Crear producto
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Inventario registrado</h2>
              <p>{loading ? 'Cargando datos...' : `${products.length} producto(s) encontrados`}</p>
            </div>
            <label className="filter">
              Filtrar por categoria
              <select value={selectedCategoryId} onChange={handleFilterChange}>
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {message ? <p className="feedback success">{message}</p> : null}
          {error ? <p className="feedback error">{error}</p> : null}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category?.name || 'Sin categoria'}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay productos para mostrar.</td>
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
