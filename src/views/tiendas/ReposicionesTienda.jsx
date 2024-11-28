import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Close } from "@mui/icons-material";

const ReposicionesTienda = () => {
  const { tiendaId } = useParams();
  const [reposiciones, setReposiciones] = useState({ docs: [], totalDocs: 0, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [detalleReposicion, setDetalleReposicion] = useState(null);

  useEffect(() => {
    const fetchReposicionesPorTienda = async () => {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${apiUrl}/reposiciones/tienda/${tiendaId}?page=${currentPage}&limit=${reposiciones.limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las reposiciones");
        }

        const data = await response.json();
        setReposiciones(data);
      } catch (error) {
        console.error("Error al obtener las reposiciones:", error);
        Swal.fire("Error!", "No se pudo obtener las reposiciones.", "error");
      }
    };

    fetchReposicionesPorTienda();
  }, [tiendaId, currentPage, reposiciones.limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenDialog = async (reposicionId) => {
    const apiUrl = import.meta.env.VITE_API_SERVER;
    const token = localStorage.getItem("token");

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center mb-6 space-x-4">
          <Link
            to="/tiendas"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-semibold"
          >
            <ArrowBackIcon fontSize="small" />
            <span>Volver</span>
          </Link>
          <h2 className="text-2xl text-gray-800 font-semibold">
            Reposiciones de la Tienda
          </h2>
        </div>

        {reposiciones.docs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto shadow-md w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3">Fecha de Reposición</th>
                  <th className="px-4 py-3">Ver Detalle</th>
                  <th className="px-4 py-3">Registrado por</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {reposiciones.docs.map((reposicion) => (
                  <tr key={reposicion._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                      {new Date(reposicion.fechaReposicion).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleOpenDialog(reposicion._id)}
                        className="text-blue-500 hover:text-blue-800"
                      >
                        Ver Detalle
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      {reposicion.usuario
                        ? `${reposicion.usuario.nombre} ${reposicion.usuario.apellido}`
                        : "Desconocido"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-700">No hay reposiciones registradas para esta tienda.</p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          pageCount={Math.ceil(reposiciones.totalDocs / reposiciones.limit)}
          onPageChange={handlePageChange}
          totalDocs={reposiciones.totalDocs}
          limit={reposiciones.limit}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.cantidadExhibida}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.deposito}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.sugerido}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.vencidos}
                        </td>
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
      </div>
    </Layout>
  );
};

export default ReposicionesTienda;