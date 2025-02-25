import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import NuevaTienda from "./NuevaTienda";
import DetalleTienda from "./DetalleTienda";
import EditarTienda from "./EditarTienda";
import PedidoForm from "./PedidoForm";
import { useTiendasStore, useGeneralStore } from "../../store/index";
import { FaEdit, FaTrash, FaShoppingCart } from "react-icons/fa";
import { Add } from "@mui/icons-material";

const Tiendas = () => {
  const {
    eliminarItem,
    searchTerm,
    currentPage,
    setSearchTerm,
    setCurrentPage,
    resetCurrentPage,
    resetSearchTerm,
  } = useGeneralStore((state) => ({
    eliminarItem: state.eliminarItem,
    searchTerm: state.searchTerm,
    currentPage: state.currentPage,
    setSearchTerm: state.setSearchTerm,
    setCurrentPage: state.setCurrentPage,
    resetCurrentPage: state.resetCurrentPage,
    resetSearchTerm: state.resetSearchTerm,
  }));

  const { tiendas, fetchTiendas } = useTiendasStore((state) => ({
    tiendas: state.tiendas,
    fetchTiendas: state.fetchTiendas,
  }));

  const { docs, totalDocs, limit } = tiendas;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTiendaId, setSelectedTiendaId] = useState(null);
  const [isDetalleOpen, setIsDetalleOpen] = useState(false);
  const [isEditarOpen, setIsEditarOpen] = useState(false);
  const [isPedidoOpen, setIsPedidoOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    resetCurrentPage();
    resetSearchTerm();
    fetchTiendas(1, "");
  }, [fetchTiendas, resetCurrentPage, resetSearchTerm]);

  const confirmarEliminarTienda = useCallback(
    (tiendaId) => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción. ¿Deseas eliminar la tienda?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          eliminarItem("tiendas", tiendaId, {
            onSuccess: () => {
              fetchTiendas(currentPage, searchTerm);
              Swal.fire("Eliminado!", "La tienda ha sido eliminada con éxito.", "success");
            },
            onError: () => {
              Swal.fire("Error!", "No se pudo eliminar la tienda.", "error");
            },
          });
        }
      });
    },
    [eliminarItem, fetchTiendas, currentPage, searchTerm]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchTiendas(newPage, searchTerm);
  };

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm(e.target.value);
      resetCurrentPage();
      fetchTiendas(1, e.target.value);
    },
    [setSearchTerm, resetCurrentPage, fetchTiendas]
  );

  const openNuevaTiendaModal = () => setIsModalOpen(true);
  const closeNuevaTiendaModal = () => setIsModalOpen(false);

  const openDetalleTienda = (tiendaId) => {
    setSelectedTiendaId(tiendaId);
    setIsDetalleOpen(true);
  };

  const closeDetalleTienda = () => {
    setSelectedTiendaId(null);
    setIsDetalleOpen(false);
  };

  const openEditarTiendaModal = (tiendaId) => {
    setSelectedTiendaId(tiendaId);
    setIsEditarOpen(true);
  };

  const closeEditarTiendaModal = () => {
    setSelectedTiendaId(null);
    setIsEditarOpen(false);
    fetchTiendas(currentPage, searchTerm);
  };

  const openPedidoDialog = (tiendaId) => {
    setSelectedTiendaId(tiendaId);
    setIsPedidoOpen(true);
  };

  const closePedidoDialog = () => {
    setIsPedidoOpen(false);
    setSelectedTiendaId(null);
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Administrar Tiendas</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={openNuevaTiendaModal}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md w-12 h-12 shadow-md focus:outline-none"
          >
            <Add fontSize="large" />
          </button>
          <input
            type="text"
            placeholder="Buscar tienda por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full md:w-3/4 lg:w-2/3 py-2 px-4 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Tienda</th>
              <th className="px-4 py-3">Pedidos</th>
              <th className="px-4 py-3">Reposiciones</th>
              <th className="px-4 py-3">Detalle</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {docs.map((tienda, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700 text-center">{tienda.nombreTienda}</td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/pedidos/tienda/${tienda._id}`}
                    className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                  >
                    Ver Pedidos
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/reposiciones/tienda/${tienda._id}`}
                    className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                  >
                    Reposiciones
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => openDetalleTienda(tienda._id)}
                    className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                  >
                    Ver Tienda
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => openEditarTiendaModal(tienda._id)}
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => confirmarEliminarTienda(tienda._id)}
                      className="text-gray-700 hover:text-red-700 transition-colors duration-200"
                    >
                      <FaTrash size={20} />
                    </button>
                    <button
                      onClick={() => openPedidoDialog(tienda._id)}
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FaShoppingCart size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        pageCount={Math.ceil(totalDocs / limit)}
        onPageChange={handlePageChange}
        totalDocs={totalDocs}
        limit={limit}
      />

      {isModalOpen && <NuevaTienda open={isModalOpen} onClose={closeNuevaTiendaModal} />}
      {isDetalleOpen && (
        <DetalleTienda open={isDetalleOpen} onClose={closeDetalleTienda} tiendaId={selectedTiendaId} />
      )}
      {isEditarOpen && (
        <EditarTienda open={isEditarOpen} onClose={closeEditarTiendaModal} tiendaId={selectedTiendaId} />
      )}
      {isPedidoOpen && (
        <PedidoForm
          open={isPedidoOpen}
          onClose={closePedidoDialog}
          tiendaId={selectedTiendaId}
        />
      )}
    </Layout>
  );
};

export default Tiendas;