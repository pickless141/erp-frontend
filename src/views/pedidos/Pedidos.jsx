import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line, RiEditLine, RiMoreFill, RiEyeLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { Menu } from '@headlessui/react';
import Layout from '../../components/Layout';
import ResumenPedidoModal from './ResumenPedidoModal';
import Pagination from '../../components/Pagination';
import useStore from '../../store';

const Pedidos = () => {
  const {
    pedidos,
    fetchPedidos,
    eliminarItem,
    currentPage,
    setCurrentPage,
    updatePedidoEstado,
  } = useStore(state => ({
    pedidos: state.pedidos,
    fetchPedidos: state.fetchPedidos,
    eliminarItem: state.eliminarItem,
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    updatePedidoEstado: state.updatePedidoEstado,
  }));

  const { docs, totalDocs, limit } = pedidos;
  const totalPages = Math.ceil(totalDocs / limit);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [pedidoResumen, setPedidoResumen] = useState([]);

  useEffect(() => {
    fetchPedidos(currentPage);
  }, [currentPage, fetchPedidos]);

  const cambiarEstadoPedido = (pedidoId, nuevoEstado) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_SERVER;

    fetch(`${apiUrl}/pedidos/${pedidoId}/cambiarEstado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ nuevoEstado }),
    })
      .then(response => Promise.all([response.ok, response.json()]))
      .then(([ok, data]) => {
        if (!ok) {
          throw new Error(data.error || 'Error al actualizar el estado del pedido');
        }
        updatePedidoEstado(pedidoId, nuevoEstado);
        Swal.fire('Actualizado', 'El estado del pedido ha sido actualizado exitosamente', 'success');
      })
      .catch((error) => {
        console.error(error);
        Swal.fire('Error', error.message, 'error');
      });
  };

  const confirmarEliminarPedido = (pedidoId) => {
    Swal.fire({
      title: '¿Deseas eliminar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem('pedidos', pedidoId, {
          onSuccess: () => {
            fetchPedidos(currentPage);
            Swal.fire('Eliminado!', 'El pedido ha sido eliminado.', 'success');
          },
          onError: () => {
            Swal.fire('Error!', 'No se pudo eliminar el pedido.', 'error');
          },
        });
      }
    });
  };

  const handleOpenModal = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    fetchPedidoResumen(pedidoId);
  };

  const fetchPedidoResumen = (pedidoId) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_SERVER;

    fetch(`${apiUrl}/pedidos/${pedidoId}/resumen`, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          Swal.fire('Error', data.error, 'error');
        } else {
          setPedidoResumen(data.pedidos);
          setIsModalOpen(true);
        }
      })
      .catch(error => {
        console.error('Error fetching resumen del pedido:', error);
        Swal.fire('Error', 'Error al cargar el resumen del pedido', 'error');
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPedidoId(null);
    setPedidoResumen([]);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Pedidos</h1>

      <div className="flex justify-between items-center mb-6">
        <Link
          to="/nuevopedido"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Nuevo Pedido
        </Link>
      </div>

      {docs && docs.map((pedido) => (
        <div key={pedido._id} className="border-t-4 mt-4 bg-white rounded p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-gray-800">Cliente: {pedido.tienda.nombreCliente}</p>
              {pedido.tienda.nombreTienda && (
                <p className="text-gray-600">{pedido.tienda.nombreTienda}</p>
              )}
              {pedido.tienda.direccion && (
                <p className="text-gray-600">{pedido.tienda.direccion}</p>
              )}

              <h2 className="text-gray-800 font-bold mt-3">Estado Pedido:</h2>
              <select
                className={`mt-2 appearance-none border p-2 text-center rounded leading-tight focus:outline-none uppercase text-xs font-bold ${
                  pedido.estado === 'PENDIENTE' ? 'bg-gray-500 text-white' : ''
                } ${
                  pedido.estado === 'COMPLETADO' ? 'bg-green-500 text-white' : ''
                } ${
                  pedido.estado === 'SUGERIDO' ? 'bg-yellow-500 text-white' : ''
                } ${pedido.estado === 'CANCELADO' ? 'bg-red-500 text-white' : ''}`}
                value={pedido.estado}
                onChange={(e) => cambiarEstadoPedido(pedido._id, e.target.value)}
              >
                <option value="COMPLETADO">COMPLETADO</option>
                <option value="SUGERIDO">SUGERIDO</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>

              <p className="text-gray-800 mt-2 font-bold">Descripción:</p>
              <p className="text-gray-600 mt-2">{pedido.descripcion || 'Sin descripción'}</p>

              
            </div>

            <div className="flex flex-col items-end">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full p-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    <RiMoreFill size={20} />
                  </Menu.Button>
                </div>

                <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/editar/${pedido._id}`}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <RiEditLine className="mr-3" size={20} /> Editar Pedido
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => confirmarEliminarPedido(pedido._id)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          <RiDeleteBin5Line className="mr-3" size={20} /> Eliminar Pedido
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleOpenModal(pedido._id)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          <RiEyeLine className="mr-3" size={20} /> Ver Pedido
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>

              <p className="text-gray-800 mt-3 font-bold">Total a pagar: <span className="font-light">Gs. {pedido.total}</span></p>
              <p className="text-gray-600 text-xs mt-2">IVA (10%): <span className="font-light">Gs. {pedido.IVA}</span></p>
              {pedido.fechaEntrega && (
                <p className="text-gray-600 text-xs mt-2">
                  Fecha de Entrega: <span className="font-light">{new Date(pedido.fechaEntrega).toLocaleDateString()}</span>
                </p>
              )}
              <p className="text-gray-600 mt-2 text-xs">
                Registrado por: {pedido.usuario.nombre} {pedido.usuario.apellido}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Modal para mostrar el resumen del pedido */}
      <ResumenPedidoModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        pedidoId={selectedPedidoId}
        pedidoResumen={pedidoResumen}
      />
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          pageCount={totalPages}
          onPageChange={handlePageChange}
          totalDocs={totalDocs}
          limit={limit}
        />
      </div>
    </Layout>
  );
};

export default Pedidos;