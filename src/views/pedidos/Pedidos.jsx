import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import Pagination from '../../components/Pagination';
import useStore from '../../store';

const Pedidos = () => {
  const {
    pedidos,
    fetchPedidos,
    eliminarItem,
    currentPage,
    setCurrentPage,
    updatePedidoEstado
  } = useStore(state => ({
    pedidos: state.pedidos,
    fetchPedidos: state.fetchPedidos,
    eliminarItem: state.eliminarItem,
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    updatePedidoEstado: state.updatePedidoEstado
  }));

  const { docs, totalDocs, limit } = pedidos;
  const totalPages = Math.ceil(totalDocs / limit);

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

      {docs &&
        docs.map((pedido) => (
          <div
            key={pedido._id}
            className="border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg"
          >
            <div>
              <p className="font-bold text-gray-800">Cliente: {pedido.tienda.nombreCliente}</p>
              {pedido.tienda.nombreTienda && <p className="flex items-center my-2">{pedido.tienda.nombreTienda}</p>}
              {pedido.tienda.direccion && <p className="flex items-center my-2">{pedido.tienda.direccion}</p>}

              <h2 className="text-gray-800 font-bold mt-10">Estado Pedido:</h2>
              <select
                className={`mt-2 appearance-none border p-2 text-center rounded leading-tight focus:outline-none uppercase text-xs font-bold ${
                  pedido.estado === 'PENDIENTE' ? 'bg-gray-500 text-white' : ''
                } ${
                  pedido.estado === 'COMPLETADO' ? 'bg-green-500 text-white' : ''
                } ${pedido.estado === 'CANCELADO' ? 'bg-red-500 text-white' : ''}`}
                value={pedido.estado}
                onChange={(e) => cambiarEstadoPedido(pedido._id, e.target.value)}
              >
                <option value="COMPLETADO">COMPLETADO</option>
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="CANCELADO">CANCELADO</option>
              </select>
              <p className="text-gray-600 mt-2">Registrado por: {pedido.usuario.nombre} {pedido.usuario.apellido}</p>
            </div>

            <div>
              <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
              {pedido.pedido &&
                pedido.pedido.map((articulo) => (
                  <div key={articulo.producto._id} className="mt-4">
                    <p className="text-sm text-gray-600">Producto: {articulo.producto.nombreProducto}</p>
                    <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>
                  </div>
                ))}

              <p className="text-gray-800 mt-3 font-bold">Total a pagar: <span className="font-light">Gs. {pedido.total}</span></p>
              <p className="text-gray-600 text-xs mt-2">IVA (10%): <span className="font-light">Gs. {pedido.IVA}</span></p>

              <button
                className="uppercase text-xs font-bold flex justify-center items-center gap-2 mx-auto mt-4 bg-red-800 px-3 py-2 text-white rounded hover:bg-red-700 transition-colors duration-300"
                onClick={() => confirmarEliminarPedido(pedido._id)}
              >
                <RiDeleteBin5Line size={20} /> Eliminar
              </button>
            </div>
          </div>
        ))}
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