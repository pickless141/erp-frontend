import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { FaTrash } from "react-icons/fa";
import { useReposicionesStore, useGeneralStore } from "../../store/index";
import { useNavigate } from "react-router-dom";

const Reposiciones = () => {
  const { reposiciones, fetchReposiciones } = useReposicionesStore((state) => ({
    reposiciones: state.reposiciones,
    fetchReposiciones: state.fetchReposiciones,
  }));

  const { eliminarItem, currentPage, setCurrentPage, resetCurrentPage } =
    useGeneralStore((state) => ({
      eliminarItem: state.eliminarItem,
      currentPage: state.currentPage,
      setCurrentPage: state.setCurrentPage,
      resetCurrentPage: state.resetCurrentPage,
    }));

  const [limit, setLimit] = useState(5);
  const [detalleReposicion, setDetalleReposicion] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    resetCurrentPage();
    fetchReposiciones(1, limit);
  }, [resetCurrentPage, limit, fetchReposiciones]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchReposiciones(page, limit);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
  };

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
            fetchReposiciones(currentPage, limit);
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
      <h1 className="text-2xl text-gray-800 font-light">Reposiciones</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/nuevoregistro")}
          className="bg-blue-800 py-2 px-5 mt-3 text-white rounded text-sm hover:bg-gray-800 uppercase font-bold w-full lg:w-auto text-center"
        >
          Agregar
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <label className="mr-2">Registros por página:</label>
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
                  {new Date(reposicion.fechaReposicion).toLocaleDateString()}
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

      {/* Dialog para los detalles de la reposición */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalle de la Reposición
          <Tooltip title="Cerrar" arrow>
            <IconButton
              onClick={handleCloseDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
              aria-label="Cerrar"
            >
              <Close />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent>
          {detalleReposicion ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Cantidad Exhibida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Depósito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Sugerido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Vencidos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {detalleReposicion.map((producto) => (
                    <tr key={producto._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {producto.producto?.nombreProducto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.cantidadExhibida}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.deposito}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.sugerido}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.vencidos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Typography>Cargando detalles...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Reposiciones;