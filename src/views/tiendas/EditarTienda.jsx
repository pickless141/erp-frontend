import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditarTienda = () => {
  const navigate = useNavigate();
  const { tiendaId } = useParams();
  const [tienda, setTienda] = useState({
    nombreCliente: '',
    nombreTienda: '',
    direccion: '',
    descripcion: '',
    productos: [],
  });
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productosEliminados, setProductosEliminados] = useState([]);

  useEffect(() => {
    const obtenerTienda = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_SERVER;
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/tiendas/tienda/${tiendaId}`, {
          method: 'GET',
          headers: {
            'x-auth-token': token,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setTienda({
            nombreCliente: data.nombreCliente,
            nombreTienda: data.nombreTienda,
            direccion: data.direccion,
            descripcion: data.descripcion,
            productos: data.productos.map(prod => ({
              id: prod.id, 
              nombre: prod.nombre, 
              precio: prod.precio,
            })),
          });
        } else {
          throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error al obtener la tienda:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    obtenerTienda();
  }, [tiendaId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTienda({ ...tienda, [name]: value });
  };

  const handlePrecioChange = (e, index) => {
    const updatedProductos = [...tienda.productos];
    updatedProductos[index].precio = parseFloat(value);
    setTienda({ ...tienda, productos: updatedProductos });
  };

  const handleDeleteProduct = (index) => {
    const updatedProductos = tienda.productos.filter((_, i) => i !== index);
    setProductosEliminados([...productosEliminados, tienda.productos[index].id]);
    setTienda({ ...tienda, productos: updatedProductos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/tiendas/${tiendaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          nombreCliente: tienda.nombreCliente,
          nombreTienda: tienda.nombreTienda,
          direccion: tienda.direccion,
          descripcion: tienda.descripcion,
          productos: tienda.productos,
          productosAEliminar: productosEliminados,
        }),
      });
      if (response.ok) {
        setExito('Tienda actualizada exitosamente');
        setTimeout(() => navigate('/tiendas'), 1000);
      } else {
        const errorData = await response.json();
        throw new Error(`Error al actualizar la tienda: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error al actualizar la tienda:', error);
      setError(error.message);
    }
  };

  if (loading) return <p>Cargando datos de la tienda...</p>;
  if (error) return <p>Error al obtener los datos de la tienda: {error}</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Editar Tienda</h1>
        {exito && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">{exito}</div>}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-6 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombreTienda" className="block text-sm font-medium text-gray-700">Nombre de la Tienda:</label>
              <input type="text" name="nombreTienda" id="nombreTienda" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={tienda.nombreTienda} onChange={handleInputChange} />
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección:</label>
              <input type="text" name="direccion" id="direccion" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={tienda.direccion} onChange={handleInputChange} />
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción:</label>
              <input type="text" name="descripcion" id="descripcion" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={tienda.descripcion} onChange={handleInputChange} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Productos:</h2>
              {tienda.productos.map((producto, index) => (
                <div key={producto.id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 mr-3">{producto.nombre} - Gs. {producto.precio}</span>
                    <input type="number" value={producto.precio} onChange={(e) => handlePrecioChange(e, index)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                  </div>
                  <button type="button" onClick={() => handleDeleteProduct(index)} className="mt-2 text-red-500 hover:text-red-700">Eliminar</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end mt-4">
            <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Actualizar</button>
            <Link to="/tiendas" className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Volver</Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditarTienda;