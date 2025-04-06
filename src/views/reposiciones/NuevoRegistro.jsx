import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useTiendasStore, useProductosStore } from '../../store/index';

const NuevoRegistro = () => {
  const navigate = useNavigate();

  const { tiendaSelect, fetchTiendaSelect } = useTiendasStore((state) => ({
    tiendaSelect: state.tiendaSelect,
    fetchTiendaSelect: state.fetchTiendaSelect,
  }));

  const { productos, fetchProductos } = useProductosStore((state) => ({
    productos: state.productos,
    fetchProductos: state.fetchProductos,
  }));

  const [tienda, setTienda] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cantidadesExhibidas, setCantidadesExhibidas] = useState({});
  const [cantidadesDeposito, setCantidadesDeposito] = useState({});
  const [cantidadesSugeridas, setCantidadesSugeridas] = useState({});
  const [cantidadesVencidas, setCantidadesVencidas] = useState({});
  const [comentario, setComentario] = useState("");
  const [exito, setExito] = useState(null);
  const [error, setError] = useState(null);

  

  useEffect(() => {
    fetchTiendaSelect();
    fetchProductos();
  }, [fetchTiendaSelect, fetchProductos]);

  useEffect(() => {
    if (categoria) {
      setProductosFiltrados(productos.filter(producto => producto.categoria === categoria.value));
    } else {
      setProductosFiltrados([]);
    }
  }, [categoria, productos]);

  const handleTiendaChange = (selectedOption) => {
    setTienda(selectedOption);
  };

  const handleCategoriaChange = (selectedOption) => {
    setCategoria(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_SERVER;

      const reposicionData = {
        tiendaId: tienda.value,
        productos: productosFiltrados.map((producto) => ({
          producto: producto._id,
          cantidadExhibida: cantidadesExhibidas[producto._id] || 0,
          deposito: cantidadesDeposito[producto._id] || 0,
          sugerido: cantidadesSugeridas[producto._id] || 0,
          vencidos: cantidadesVencidas[producto._id] || 0,
        })),
        categoria: categoria.value,
        comentario,
      };

      await axios.post(`${apiUrl}/reposiciones/`, reposicionData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json',
        },
      });

      setExito('Reposición creada exitosamente');
      setTimeout(() => {
        navigate('/reposiciones');
      }, 2000);
    } catch (error) {
      console.error('Error al crear una nueva reposición:', error);
      setError('Error al crear una nueva reposición');
    }
  };

  const categoriaOptions = [
    { value: 'Lievito', label: 'Lievito' },
    { value: 'EatWell', label: 'EatWell' },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl text-gray-800 font-light mb-4">Nueva Reposición</h1>

        {exito && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            {exito}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            {error}
          </div>
        )}

        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Selecciona la tienda</label>
              <Select options={tiendaSelect} onChange={handleTiendaChange} value={tienda} />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <Select options={categoriaOptions} onChange={handleCategoriaChange} value={categoria} />
            </div>
          </div>

          {productosFiltrados.length > 0 && (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full border divide-y">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Productos</th>
                    <th className="py-2 px-4 border-b">Cant. Exhibida</th>
                    <th className="py-2 px-4 border-b">Cant. Depósito</th>
                    <th className="py-2 px-4 border-b">Cant. Sugerida</th>
                    <th className="py-2 px-4 border-b">Cant. Vencida</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto._id}>
                      <td className="py-2 px-4 border-b">{producto.nombreProducto}</td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded"
                          value={cantidadesExhibidas[producto._id] || ''}
                          onChange={(e) =>
                            setCantidadesExhibidas((prevState) => ({
                              ...prevState,
                              [producto._id]: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded"
                          value={cantidadesDeposito[producto._id] || ''}
                          onChange={(e) =>
                            setCantidadesDeposito((prevState) => ({
                              ...prevState,
                              [producto._id]: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded"
                          value={cantidadesSugeridas[producto._id] || ''}
                          onChange={(e) =>
                            setCantidadesSugeridas((prevState) => ({
                              ...prevState,
                              [producto._id]: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded"
                          value={cantidadesVencidas[producto._id] || ''}
                          onChange={(e) =>
                            setCantidadesVencidas((prevState) => ({
                              ...prevState,
                              [producto._id]: e.target.value,
                            }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Comentario</label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              rows="2"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            ></textarea>
          </div>

          <div className="flex items-center justify-center mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Guardar
            </button>
            <button
              type="button"
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => navigate('/reposiciones')}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NuevoRegistro;