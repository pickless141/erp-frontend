import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import { Close } from "@mui/icons-material";

const PedidosTienda = () => {
  const { tiendaId } = useParams();
  const [pedidos, setPedidos] = useState({ docs: [], totalDocs: 0, limit: 10 });
  const [currentPage, setCurrentPage] = useState(1);
  const [nombreTienda, setNombreTienda] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  

  useEffect(() => {
    const fetchPedidosPorTienda = async () => {
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${apiUrl}/pedidos/tienda/${tiendaId}?page=${currentPage}&limit=${pedidos.limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }

        const data = await response.json();
        setPedidos(data);
        if (data.docs.length > 0) {
          setNombreTienda(data.docs[0].tienda.nombreTienda);
        }
      } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        Swal.fire("Error!", "La tienda no tiene pedidos.");
      }
    };

    fetchPedidosPorTienda();
  }, [tiendaId, currentPage, pedidos.limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenDialog = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await fetch(`${apiUrl}/pedidos/${pedidoId}/resumen`, {
        headers: { "x-auth-token": token },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el resumen del pedido");
      }

      const data = await response.json();
      setSelectedPedido(data.pedidos); // Ajusta esta línea según la estructura de tu respuesta
      setOpenDialog(true);
    } catch (error) {
      console.error("Error al obtener los detalles del pedido:", error);
      Swal.fire("Error!", "No se pudo cargar el resumen del pedido.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPedido(null);
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
            Pedidos de {nombreTienda || "Cargando..."}
          </h2>
        </div>

        {pedidos.docs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto shadow-md w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3">Fecha del Pedido</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Resumen del Pedido</th>
                  <th className="px-4 py-3">Monto Total</th>
                  <th className="px-4 py-3">Registrado por</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pedidos.docs.map((pedido) => (
                  <tr key={pedido._id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                      {new Date(pedido.fechaPedido).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">{pedido.estado}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleOpenDialog(pedido._id)}
                        className="text-blue-500 hover:text-blue-800"
                      >
                        Ver Resumen
                      </button>
                    </td>
                    <td className="border px-4 py-2">{pedido.total} Gs.</td>
                    <td className="border px-4 py-2">
                      {pedido.usuario
                        ? `${pedido.usuario.nombre} ${pedido.usuario.apellido}`
                        : "Desconocido"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-700">
              No hay pedidos registrados para esta tienda.
            </p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          pageCount={Math.ceil(pedidos.totalDocs / pedidos.limit)}
          onPageChange={handlePageChange}
          totalDocs={pedidos.totalDocs}
          limit={pedidos.limit}
        />

        {/* Dialog para el resumen del pedido */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            Detalle del Pedido
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
            {selectedPedido ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 divide-y divide-gray-300">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Cantidad
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    {selectedPedido.map((producto) => (
                      <tr key={producto._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.producto}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.cantidad}
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

export default PedidosTienda;