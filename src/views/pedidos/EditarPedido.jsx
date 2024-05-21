import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import axios from 'axios';
import AgregarModal from './AgregarModal';

const EditarPedido = () => {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [productosTienda, setProductosTienda] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [descripcion, setDescripcion] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cargarPedido = async () => {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_SERVER;
      try {
        const response = await axios.get(`${apiUrl}/pedidos/${pedidoId}`, {
          headers: { 'x-auth-token': token }
        });
        const pedido = response.data.pedido;
        setDescripcion(pedido.descripcion || '');
        setFechaEntrega(pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toISOString().substring(0, 10) : '');
        setProductos(pedido.pedido);
        cantidadesIniciales(pedido.pedido);
        cargarProductosTienda(pedido.tienda._id);
      } catch (error) {
        console.error('Error al cargar el pedido:', error);
        Swal.fire('Error', 'No se pudo cargar el pedido', 'error');
      }
    };
    cargarPedido();
  }, [pedidoId]);

  const cantidadesIniciales = (pedido) => {
    const initCantidades = {};
    pedido.forEach((articulo) => {
      initCantidades[articulo.producto._id] = articulo.cantidad;
    });
    setCantidades(initCantidades);
  };

  const cargarProductosTienda = async (tiendaId) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_SERVER;
    try {
      const response = await axios.get(`${apiUrl}/tiendas/${tiendaId}/detalle`, {
        headers: { 'x-auth-token': token }
      });
      setProductosTienda(response.data.productos || []);
    } catch (error) {
      console.error('Error al cargar productos de la tienda:', error);
    }
  };

  const handleCantidadChange = (productoId, value) => {
    setCantidades(prev => ({ ...prev, [productoId]: Number(value) }));
  };

  const eliminarProducto = (productoId) => {
    setProductos(prev => prev.filter(articulo => articulo.producto._id !== productoId));
    const nuevasCantidades = { ...cantidades };
    delete nuevasCantidades[productoId];
    setCantidades(nuevasCantidades);
  };

  const agregarProducto = (producto) => {
    const yaExiste = productos.some(p => p.producto._id === producto._id);
    if (!yaExiste) {
      setProductos(prev => [...prev, { producto, cantidad: 1 }]);
      setCantidades(prev => ({ ...prev, [producto._id]: 1 }));
      setIsModalOpen(false);
    } else {
      Swal.fire('Advertencia', 'Este producto ya está en el pedido', 'warning');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pedidoProductos = productos.map(articulo => ({
      productoId: articulo.producto._id,
      cantidad: cantidades[articulo.producto._id] || 0
    })).filter(p => p.cantidad > 0);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_SERVER;
      await axios.put(`${apiUrl}/pedidos/editar/${pedidoId}`, {
        descripcion: descripcion || '',
        productos: pedidoProductos,
        fechaEntrega: fechaEntrega || null
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      Swal.fire('Éxito', 'El pedido ha sido actualizado exitosamente', 'success');
      navigate('/pedidos');
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
      Swal.fire('Error', 'No se pudo actualizar el pedido', 'error');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Editar Pedido</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Sin descripción"
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Fecha de Entrega (opcional):</label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              className="mt-1 w-40 p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {productos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Productos del Pedido</h2>
              {productos.map((articulo) => (
                <div key={articulo.producto._id} className="flex justify-between items-center mt-4">
                  <span className="text-gray-700">{articulo.producto.nombreProducto}</span>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={cantidades[articulo.producto._id] || ''}
                      onChange={(e) => handleCantidadChange(articulo.producto._id, e.target.value)}
                      className="w-24 p-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 mr-2"
                    />
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => eliminarProducto(articulo.producto._id)}
                    >
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <Link
              to="/pedidos"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Volver
            </Link>
            <div className="flex space-x-2">
              <button type="button" onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-600 p-2 rounded text-white">
                <FaPlus size={20} />
              </button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white">
                <FaEdit size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal para agregar productos */}
      <AgregarModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        productosTienda={productosTienda}
        agregarProducto={agregarProducto}
      />
    </Layout>
  );
};

export default EditarPedido;