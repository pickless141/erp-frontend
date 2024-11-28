import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Pagination from "../components/Pagination";
import ClienteTiendaDetail from "./clientes/ClienteTiendaDetail";
import EditarCliente from "./clientes/EditarCliente";
import NuevoCliente from "./clientes/NuevoCliente"; 
import { useClientesStore, useGeneralStore } from "../store/index";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const { clientes, fetchClientes } = useClientesStore((state) => ({
    clientes: state.clientes,
    fetchClientes: state.fetchClientes,
  }));

  
  const { eliminarItem, searchTerm, setSearchTerm, currentPage, setCurrentPage, resetCurrentPage, resetSearchTerm } = useGeneralStore((state) => ({
    eliminarItem: state.eliminarItem,
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
    currentPage: state.currentPage,
    setCurrentPage: state.setCurrentPage,
    resetCurrentPage: state.resetCurrentPage,
    resetSearchTerm: state.resetSearchTerm,
  }));

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteEditarId, setClienteEditarId] = useState(null);
  const [isNuevoClienteModalOpen, setIsNuevoClienteModalOpen] = useState(false); // Estado para el modal

  useEffect(() => {
    resetCurrentPage();
    resetSearchTerm();
    fetchClientes(1, "");
  }, [fetchClientes, resetCurrentPage, resetSearchTerm]);

  const confirmarEliminarCliente = (clienteId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir. ¿Deseas eliminar el cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem("clientes", clienteId, {
          onSuccess: () => {
            Swal.fire("Eliminado!", "El cliente ha sido eliminado.", "success");
            fetchClientes(currentPage, searchTerm);
          },
          onError: () => {
            Swal.fire("Error!", "No se pudo eliminar el cliente.", "error");
          },
        });
      }
    });
  };

  const handleVerTiendasClick = (clienteId) => {
    if (clienteId) {
      setClienteSeleccionado(clienteId);
    } else {
      console.error("clienteId es undefined");
    }
  };

  const handleEditarClienteClick = (clienteId) => {
    if (clienteId) {
      setClienteEditarId(clienteId);
      setClienteSeleccionado(clienteId);
      navigate(`/editarcliente/${clienteId}`);
    } else {
      console.error("clienteId es undefined");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchClientes(newPage, searchTerm);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    resetCurrentPage();
    fetchClientes(1, term);
  };

  const pageCount = Math.ceil(clientes.totalDocs / clientes.limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Clientes</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <button
          onClick={() => setIsNuevoClienteModalOpen(true)} 
          className="bg-blue-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full md:w-auto text-center md:mr-3 transition-colors duration-300"
        >
          Nuevo Cliente
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre de cliente"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="block w-full py-2 px-3 border rounded shadow-sm mb-3 md:mb-0"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Ruc</th>
              <th className="px-4 py-3">Tiendas</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {clientes.docs.map((cliente, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700 text-center">{cliente.nombre}</td>
                <td className="border px-4 py-2 text-center">{cliente.ruc}</td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/home/${cliente._id}`}
                    onClick={() => handleVerTiendasClick(cliente._id)}
                    className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                  >
                    Ver Tiendas
                  </Link>
                </td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleEditarClienteClick(cliente._id)}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => confirmarEliminarCliente(cliente._id)}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors duration-200"
                    >
                      <FaTrash size={20} />
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
        pageCount={pageCount}
        onPageChange={handlePageChange}
        totalDocs={clientes.totalDocs}
        limit={clientes.limit}
      />

      {clienteSeleccionado && <ClienteTiendaDetail clienteId={clienteSeleccionado} />}
      {clienteEditarId && <EditarCliente clienteId={clienteEditarId} />}
      <NuevoCliente open={isNuevoClienteModalOpen} onClose={() => setIsNuevoClienteModalOpen(false)} /> {/* Modal de NuevoCliente */}
    </Layout>
  );
};

export default Home;