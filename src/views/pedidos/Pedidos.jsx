import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Layout from "../../components/Layout";
import ResumenPedidoModal from "./ResumenPedidoModal";
import EditarPedido from "./EditarPedido";
import Pagination from "../../components/Pagination";
import { usePedidosStore, useGeneralStore } from "../../store/index";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Card,
  CardContent,
  IconButton,
  Divider,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const Pedidos = () => {
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isResumenModalOpen, setIsResumenModalOpen] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const { pedidos, fetchPedidos, updatePedidoEstado } = usePedidosStore((state) => ({
    pedidos: state.pedidos,
    fetchPedidos: state.fetchPedidos,
    updatePedidoEstado: state.updatePedidoEstado,
  }));

  const { eliminarItem, currentPage, setCurrentPage, resetCurrentPage } =
    useGeneralStore((state) => ({
      eliminarItem: state.eliminarItem,
      currentPage: state.currentPage,
      setCurrentPage: state.setCurrentPage,
      resetCurrentPage: state.resetCurrentPage,
    }));

  const { docs, totalDocs, limit } = pedidos;
  const totalPages = Math.ceil(totalDocs / limit);

  

  useEffect(() => {
    resetCurrentPage();
    fetchPedidos(1);
  }, [fetchPedidos, resetCurrentPage]);

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    const result = await updatePedidoEstado(pedidoId, nuevoEstado);
    if (result.success) {
      Swal.fire(
        "Actualizado",
        "El estado del pedido ha sido actualizado exitosamente",
        "success"
      );
    } else {
      Swal.fire("Error", "No se pudo actualizar el estado del pedido", "error");
    }
  };

  const confirmarEliminarPedido = (pedidoId) => {
    Swal.fire({
      title: "¿Deseas eliminar este pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem("pedidos", pedidoId, {
          onSuccess: () => {
            fetchPedidos(currentPage);
            Swal.fire("Eliminado!", "El pedido ha sido eliminado.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "No se pudo eliminar el pedido.", "error");
          },
        });
      }
    });
  };

  const handleOpenEditarModal = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setIsEditarModalOpen(true);
  };

  const handleOpenResumenModal = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setIsResumenModalOpen(true);
  };

  const handleCloseEditarModal = () => {
    setIsEditarModalOpen(false);
    setSelectedPedidoId(null);
  };

  const handleCloseResumenModal = () => {
    setIsResumenModalOpen(false);
    setSelectedPedidoId(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchPedidos(newPage);
    }
  };

  return (
    <Layout>
      <Typography variant="h5" className="text-gray-800 font-light mb-6">
        Pedidos
      </Typography>

      <Box className="flex justify-between items-center mb-6">
        <Button
          component={Link}
          to="/nuevopedido"
          variant="contained"
          color="primary"
        >
          Nuevo Pedido
        </Button>
      </Box>

      {docs.map((pedido) => (
        <Card key={pedido._id} className="border-t-4 mt-4 shadow-lg">
          <CardContent>
            <Box className="flex justify-between items-start">
              <Box>
                <Typography variant="h6" className="font-bold text-gray-800">
                  Cliente: {pedido.tienda.nombreCliente}
                </Typography>
                {pedido.tienda.nombreTienda && (
                  <Typography variant="body2" className="text-gray-600">
                    {pedido.tienda.nombreTienda}
                  </Typography>
                )}
                {pedido.tienda.direccion && (
                  <Typography variant="body2" className="text-gray-600">
                    {pedido.tienda.direccion}
                  </Typography>
                )}
                <Typography variant="subtitle1" className="font-bold mt-3 text-gray-800">
                  Estado Pedido:
                </Typography>
                <Select
                  value={pedido.estado}
                  onChange={(e) => cambiarEstadoPedido(pedido._id, e.target.value)}
                  size="small"
                  sx={{ mt: 1, textTransform: "uppercase" }}
                >
                  <MenuItem value="COMPLETADO">COMPLETADO</MenuItem>
                  <MenuItem value="SUGERIDO">SUGERIDO</MenuItem>
                  <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                  <MenuItem value="CANCELADO">CANCELADO</MenuItem>
                </Select>
                <Typography variant="body2" className="text-gray-800 mt-2">
                  Descripción: {pedido.descripcion || "Sin descripción"}
                </Typography>
              </Box>

              <Box className="text-right">
                <Typography variant="body2" className="font-bold text-gray-800">
                  Total a pagar: Gs. {pedido.total}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  IVA (10%): Gs. {pedido.IVA}
                </Typography>
                <Typography variant="caption" className="text-gray-600">
                  Registrado por: {pedido.usuario.nombre} {pedido.usuario.apellido}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <Divider />
          <Box className="flex justify-end space-x-2 p-3">
            <IconButton
              onClick={() => handleOpenEditarModal(pedido._id)}
              color="primary"
              size="small"
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => confirmarEliminarPedido(pedido._id)}
              color="error"
              size="small"
            >
              <Delete />
            </IconButton>
            <IconButton
              onClick={() => handleOpenResumenModal(pedido._id)}
              color="default"
              size="small"
            >
              <Visibility />
            </IconButton>
          </Box>
        </Card>
      ))}
      {isEditarModalOpen && (
        <EditarPedido
          open={isEditarModalOpen}
          onClose={handleCloseEditarModal}
          pedidoId={selectedPedidoId}
          onPedidoActualizado={() => fetchPedidos(currentPage)}
        />
      )}

      {isResumenModalOpen && (
        <ResumenPedidoModal
          open={isResumenModalOpen}
          onClose={handleCloseResumenModal}
          pedidoId={selectedPedidoId}
        />
      )}
      <Box className="mt-8">
        <Pagination
          currentPage={currentPage}
          pageCount={totalPages}
          onPageChange={handlePageChange}
          totalDocs={totalDocs}
          limit={limit}
        />
      </Box>
    </Layout>
  );
};

export default Pedidos;