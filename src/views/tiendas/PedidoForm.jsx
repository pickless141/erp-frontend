import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';

const PedidoForm = () => {
  const { tiendaId } = useParams();
  const navigate = useNavigate();
  const [tienda, setTienda] = useState({ productos: [] });
  const [pedido, setPedido] = useState([]);
  const apiUrl = import.meta.env.VITE_API_SERVER;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTiendaDetalle = async () => {
      try {
        const response = await fetch(`${apiUrl}/tiendas/tienda/${tiendaId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
  
        if (!response.ok) {
          throw new Error('Error al obtener los detalles de la tienda');
        }
  
        const data = await response.json();
        setTienda(data);
  
        const inicialPedido = data.productos.map((producto) => ({
          productoId: producto.id, 
          cantidad: 0,
        }));
        setPedido(inicialPedido);
      } catch (error) {
        console.error(error.message);
      }
    };
  
    fetchTiendaDetalle();
  }, [tiendaId, apiUrl, token]);

  const handleCantidadChange = (index, cantidad) => {
    const nuevoPedido = [...pedido];
    nuevoPedido[index].cantidad = Number(cantidad);
    setPedido(nuevoPedido);
  };

  const handleConfirmarPedido = async () => {
    const result = await Swal.fire({
      title: '¿Desea confirmar el pedido?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    });
  
    if (result.isConfirmed) {
      const pedidoParaEnviar = pedido.filter((item) => item.cantidad > 0).map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
      }));
  
      if (pedidoParaEnviar.length === 0) {
        Swal.fire(
          'Pedido vacío',
          'No puedes confirmar un pedido sin productos.',
          'error'
        );
        return;
      }
  
      try {
        const response = await fetch(`${apiUrl}/pedidos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            tiendaId,
            productos: pedidoParaEnviar,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al enviar el pedido');
        }
  
        await response.json(); 
        Swal.fire(
          'Pedido confirmado',
          'El pedido ha sido confirmado con éxito.',
          'success'
        );
        navigate('/tiendas'); 
      } catch (error) {
        console.error('Error al enviar el pedido:', error);
        Swal.fire(
          'Error',
          error.message,
          'error'
        );
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <h1 className="text-2xl font-semibold text-center text-gray-700">
            Pedido para {tienda.nombreTienda}
          </h1>
          <div className="my-2 flex sm:flex-row flex-col">
            <div className="block relative">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                  <path d="M10,17a1,1 0 0,1 -1,-1a1,1 0 0,1 1,-1a1,1 0 0,1 1,1a1,1 0 0,1 -1,1m0,-10a1,1 0 0,1 -1,-1a1,1 0 0,1 1,-1a1,1 0 0,1 1,1a1,1 0 0,1 -1,1m0,6a1,1 0 0,1 -1,-1a1,1 0 0,1 1,-1a1,1 0 0,1 1,1a1,1 0 0,1 -1,1Z" />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                <table className="min-w-full">
                  <tbody className="bg-white">
                    {tienda.productos.map((producto, index) => (
                      <tr key={producto.id} className="hover:bg-gray-100">
                        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-700">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm leading-5 font-medium text-gray-900">{producto.nombre}</div>
                              <div className="text-sm leading-5 text-gray-500">Gs. {producto.precio}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                          <input
                            type="number"
                            value={pedido[index]?.cantidad || 0}
                            onChange={(e) => handleCantidadChange(index, e.target.value)}
                            className="form-input rounded-md shadow-sm mt-1 block w-full"
                            min="0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <Link to="/tiendas" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-lg">
              Volver
            </Link>
            <button onClick={handleConfirmarPedido} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg">
              Confirmar Pedido
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PedidoForm;