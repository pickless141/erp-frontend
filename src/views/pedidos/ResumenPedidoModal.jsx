import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import Swal from 'sweetalert2';

const ResumenPedidoModal = ({ isOpen, closeModal, pedidoId }) => {
  const [productos, setProductos] = useState([]);
  const [nombreTienda, setNombreTienda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && pedidoId) {
      setLoading(true);
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_SERVER;

      fetch(`${apiUrl}/pedidos/${pedidoId}/resumen`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
          }
          return response.json();
        })
        .then(data => {
          if (data.error) {
            Swal.fire('Error', data.error, 'error');
          } else {
            setProductos(data.pedidos || []);
            setNombreTienda(data.tienda ? data.tienda.nombre : '');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching resumen del pedido:', error.message);
          Swal.fire('Error', 'Error al cargar el resumen del pedido', 'error');
          setLoading(false);
        });
    }
  }, [isOpen, pedidoId]);

  return (
    <Dialog open={isOpen} onClose={closeModal} className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded shadow-lg relative">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            aria-label="Cerrar"
          >
            <RiCloseLine size={24} />
          </button>
          <Dialog.Title className="text-lg font-bold">
            Pedido de: {nombreTienda || 'Sin nombre de tienda'}
          </Dialog.Title>
          {loading ? (
            <p>Cargando...</p>
          ) : productos.length > 0 ? (
            productos.map((articulo) => (
              <div key={articulo._id} className="mt-2">
                <p>Producto: {articulo.producto}</p>
                <p>Cantidad: {articulo.cantidad}</p>
              </div>
            ))
          ) : (
            <p>No hay productos en este pedido.</p>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ResumenPedidoModal;