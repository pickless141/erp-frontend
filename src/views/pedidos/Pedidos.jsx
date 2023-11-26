import { useState, useEffect } from 'react';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

const Pedidos = () => {
  const [localPedidos, setLocalPedidos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_SERVER;

    fetch(`${apiUrl}/pedidos/?page=${currentPage}&perPage=3`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.pedidos) {
          setLocalPedidos(data.pedidos);
          setTotalPages(Math.ceil(data.totalPedidos / 3));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentPage]);

  const cambiarEstadoPedido = (pedidoId, nuevoEstado) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_SERVER;

    fetch(`${apiUrl}/pedidos/${pedidoId}/cambiarEstado`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({ pedidoId, nuevoEstado }),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedLocalPedidos = localPedidos.map((pedido) => {
          if (pedido._id === pedidoId) {
            return { ...pedido, estado: nuevoEstado };
          }
          return pedido;
        });
        setLocalPedidos(updatedLocalPedidos);
      })
      .catch((error) => {
        console.error(error);
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
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_SERVER;
        fetch(`${apiUrl}/pedidos/${pedidoId}`, {
          method: 'DELETE',
          headers: {
            'x-auth-token': token,
          },
        })
          .then((response) => {
            if (response.ok) {
              const updatedLocalPedidos = localPedidos.filter((pedido) => pedido._id !== pedidoId);
              setLocalPedidos(updatedLocalPedidos);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar el pedido',
                text: 'Hubo un problema al intentar eliminar el pedido.',
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar el pedido',
              text: 'Hubo un error inesperado al intentar eliminar el pedido.',
            });
          });
      }
    });
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-4">Pedidos</h1>
      <Link
        to="/nuevopedido"
        className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center"
      >
        Nuevo Pedido
      </Link>

      {localPedidos &&
        localPedidos.map((pedido) => (
          <div
            key={pedido._id}
            className={`border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}
          >
            <div>
              <p className="font-bold text-gray-800">Cliente: {pedido.tienda.nombreCliente}</p>

              {pedido.tienda.nombreTienda && (
                <p className="flex items-center my-2">{pedido.tienda.nombreTienda}</p>
              )}

              {pedido.tienda.direccion && (
                <p className="flex items-center my-2">{pedido.tienda.direccion}</p>
              )}

              <h2 className="text-gray-800 font-bold mt-10">Estado Pedido:</h2>

              <select
                className={`mt-2 appearance-none border text-white p-2 text-center rounded leading-tight focus:outline-none focus:border-blue-500 uppercase text-xs font-bold ${
                  pedido.estado === 'PENDIENTE' ? 'bg-gray-500' : ''
                } ${
                  pedido.estado === 'COMPLETADO' ? 'bg-green-500' : ''
                } ${pedido.estado === 'CANCELADO' ? 'bg-red-500' : ''}`}
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
                    <p className="text-sm text-gray-600">
                      Producto: {articulo.producto.nombreProducto}
                    </p>
                    <p className="text-sm text-gray-600">Cantidad: {articulo.cantidad}</p>
                  </div>
                ))}

              <p className="text-gray-800 mt-3 font-bold">
                Total a pagar: <span className="font-light"> Gs. {pedido.total}</span>
              </p>

              <button
                className="uppercase text-xs font-bold block mx-auto mt-4 bg-red-800 px-3 py-2 text-white rounded"
                onClick={() => confirmarEliminarPedido(pedido._id)}
              >
                <RiDeleteBin5Line color="white" size={20} />
              </button>
            </div>
          </div>
        ))}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-2 px-4 py-2 text-sm ${
              currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'
            } rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Layout>
  );
};

export default Pedidos;