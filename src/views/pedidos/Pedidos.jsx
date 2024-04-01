import { useEffect } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import useStore from '../../store';

const Pedidos = () => {
  const { pedidos, fetchPedidos, eliminarItem, currentPage, setCurrentPage,totalPages } = useStore((state) => ({
    pedidos: state.pedidos.docs,
    fetchPedidos: state.fetchPedidos,
    eliminarItem: state.eliminarItem,
    currentPage: state.pedidos.currentPage,
    setCurrentPage: state.setCurrentPage,
    totalPages: state.pedidos.totalPages,
  }));

  useEffect(() => {
    fetchPedidos(currentPage);
  }, [currentPage, fetchPedidos]);
  
  const { updatePedidoEstado } = useStore();
  
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPedidos(page);
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Pedidos</h1>

      {pedidos &&
        pedidos.map((pedido) => (
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
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-2 px-4 py-2 text-sm ${
              currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'
            } rounded hover:bg-gray-700 transition-colors duration-300`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default Pedidos;