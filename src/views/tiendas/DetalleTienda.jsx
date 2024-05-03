import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductoModal from './ProductoModal';

const DetalleTienda = () => {
  const { id } = useParams();
  const [tienda, setTienda] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTiendaDetalle = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await fetch(`${apiUrl}/tiendas/${id}/detalle`, {
        method: 'GET',
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la tienda');
      }

      const data = await response.json();
      setTienda(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTiendaDetalle();
  }, [id]);
  
  const abrirModal = () => setShowModal(true);
  const cerrarModalYActualizar = () => {
    setShowModal(false);
    fetchTiendaDetalle(); 
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
        {tienda ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">{tienda.nombreCliente} - {tienda.nombreTienda}</h2>
            <p className="mb-4 text-gray-600"><strong>Dirección:</strong> {tienda.direccion}</p>
            <p className="mb-5 text-gray-600"><strong>Descripción:</strong> {tienda.descripcion}</p>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Productos</h3>
            <ul className="mb-5">
              {tienda.productos.map((productoDetalle, index) => (
                <li key={index} className="py-2 border-b border-gray-200">
                  <strong className="text-gray-700">{productoDetalle.nombre}</strong> - Gs. {productoDetalle.precio}
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mt-5">
          <Link to="/tiendas" className="px-5 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Volver
          </Link>
          <button onClick={abrirModal} className="flex items-center px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Nuevo Producto
          </button>
        </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Cargando detalles de la tienda...</p>
        )}
        {showModal && <ProductoModal onClose={cerrarModalYActualizar} tiendaId={id} />}
      </div>
    </Layout>
  );
};

export default DetalleTienda;