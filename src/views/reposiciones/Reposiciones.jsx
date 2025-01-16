import React, { useState, useEffect, useCallback } from "react";
import moment, { formatDate } from "../../utils/moment";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";
import { Add } from "@mui/icons-material";
import { FaTrash } from "react-icons/fa";
import { useReposicionesStore, useGeneralStore } from "../../store/index";
import { useNavigate } from "react-router-dom";
import DialogoDetalles from "../../components/DialogoDetalles";

const Reposiciones = () => {
  const { reposiciones, fetchReposiciones } = useReposicionesStore((state) => ({
    reposiciones: state.reposiciones,
    fetchReposiciones: state.fetchReposiciones,
  }));

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

  const [limit, setLimit] = useState(5);
  const [detalleReposicion, setDetalleReposicion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    resetCurrentPage();
    fetchReposiciones(1, limit, searchTerm);
  }, [fetchReposiciones, resetCurrentPage, limit, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchReposiciones(page, limit, searchTerm);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
  };

  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      resetCurrentPage();
      fetchReposiciones(1, limit, value);
    },
    [setSearchTerm, resetCurrentPage, fetchReposiciones, limit]
  );

  const confirmarEliminarReposicion = (reposicionId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir. ¿Deseas eliminar la reposición?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem("reposiciones", reposicionId, {
          onSuccess: () => {
            Swal.fire("Eliminado!", "La reposición ha sido eliminada.", "success");
            fetchReposiciones(currentPage, limit, searchTerm);
          },
          onError: () => {
            Swal.fire("Error!", "No se pudo eliminar la reposición.", "error");
          },
        });
      }
    });
  };

  const handleOpenDialog = async (reposicionId) => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_SERVER;

    try {
      const response = await fetch(
        `${apiUrl}/reposiciones/${reposicionId}/detalles-productos`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los detalles de la reposición");
      }

      const data = await response.json();
      setDetalleReposicion(data.productos);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al obtener los detalles de la reposición:", error);
      Swal.fire("Error!", "No se pudo cargar los detalles de la reposición.", "error");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDetalleReposicion(null);
  };

  const pageCount = Math.ceil(reposiciones.totalDocs / limit);

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light mb-6">Reposiciones</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={() => navigate("/nuevoregistro")}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md w-12 h-12 shadow-md focus:outline-none"
          >
            <Add fontSize="large" />
          </button>
          <input
            type="text"
            placeholder="Buscar reposición por nombre de tienda"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full md:w-3/4 lg:w-2/3 py-2 px-4 border border-gray-300 rounded shadow-sm focus:ring focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs">Registros por página:</label>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Tienda</th>
              <th className="px-4 py-2">Productos</th>
              <th className="px-4 py-2">Fecha de Reposición</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Registrado por</th>
              <th className="px-4 py-2 text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {reposiciones.docs.map((reposicion) => (
              <tr key={reposicion._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{reposicion.tienda?.nombreTienda}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleOpenDialog(reposicion._id)}
                    className="text-blue-500 hover:underline"
                  >
                    Ver Productos
                  </button>
                </td>
                <td className="border px-4 py-2">
                  {formatDate(reposicion.fechaReposicion)}
                </td>
                <td className="border px-4 py-2">
                  {reposicion.productos.length > 0 &&
                    reposicion.productos[0].producto.categoria}
                </td>
                <td className="border px-4 py-2">
                  {reposicion.usuario
                    ? `${reposicion.usuario.nombre} ${reposicion.usuario.apellido}`
                    : "Desconocido"}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => confirmarEliminarReposicion(reposicion._id)}
                    className="text-red-500 hover:text-red-700 transition duration-300 inline-flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
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
        totalDocs={reposiciones.totalDocs}
        limit={limit}
      />

      <DialogoDetalles
        open={openDialog}
        onClose={handleCloseDialog}
        titulo="Detalle de la Reposición"
        detalleReposicion={detalleReposicion}
      />
    </Layout>
  );
};

export default Reposiciones;