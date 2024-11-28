import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { Close, Delete, Add, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import AgregarModal from "./AgregarModal";
import axios from "axios";


const EditarPedido = ({ pedidoId, onClose, onPedidoActualizado }) => {
  const [productos, setProductos] = useState([]);
  const [productosTienda, setProductosTienda] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [descripcion, setDescripcion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (pedidoId) {
      cargarPedido();
    }
  }, [pedidoId]);

  const cargarPedido = async () => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_SERVER;

    try {
      const response = await axios.get(`${apiUrl}/pedidos/${pedidoId}`, {
        headers: { "x-auth-token": token },
      });
      const pedido = response.data.pedido;
      setDescripcion(pedido.descripcion || "");
      setProductos(pedido.pedido);
      cantidadesIniciales(pedido.pedido);
      cargarProductosTienda(pedido.tienda._id);

    } catch (error) {
      console.error("Error al cargar el pedido:", error);
      Swal.fire("Error", "No se pudo cargar el pedido", "error");
    }
  };

  const cantidadesIniciales = (pedido) => {
    const initCantidades = {};
    pedido.forEach((articulo) => {
      initCantidades[articulo.producto._id] = articulo.cantidad;
    });
    setCantidades(initCantidades);
  };

  const cargarProductosTienda = async (tiendaId) => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_SERVER;
    try {
      const response = await axios.get(`${apiUrl}/tiendas/${tiendaId}/detalle`, {
        headers: { "x-auth-token": token },
      });
      setProductosTienda(response.data.productos || []);
    } catch (error) {
      console.error("Error al cargar productos de la tienda:", error);
    }
  };

  const handleCantidadChange = (productoId, value) => {
    setCantidades((prev) => ({ ...prev, [productoId]: Number(value) }));
  };

  const eliminarProducto = (productoId) => {
    setProductos((prev) => prev.filter((articulo) => articulo.producto._id !== productoId));
    const nuevasCantidades = { ...cantidades };
    delete nuevasCantidades[productoId];
    setCantidades(nuevasCantidades);
  };

  const agregarProducto = (producto) => {
    const yaExiste = productos.some((p) => p.producto._id === producto._id);
    if (!yaExiste) {
      setProductos((prev) => [...prev, { producto, cantidad: 1 }]);
      setCantidades((prev) => ({ ...prev, [producto._id]: 1 }));
      setIsModalOpen(false);
    } else {
      Swal.fire("Advertencia", "Este producto ya está en el pedido", "warning");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pedidoProductos = productos
      .map((articulo) => ({
        productoId: articulo.producto._id,
        cantidad: cantidades[articulo.producto._id] || 0,
      }))
      .filter((p) => p.cantidad > 0);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_SERVER;
      await axios.put(
        `${apiUrl}/pedidos/editar/${pedidoId}`,
        {
          descripcion: descripcion || "",
          productos: pedidoProductos,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );
      Swal.fire("Éxito", "El pedido ha sido actualizado exitosamente", "success");
      onPedidoActualizado(); 
      onClose();
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
      Swal.fire("Error", "No se pudo actualizar el pedido", "error");
    }
  };

  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Editar Pedido
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Descripción:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Sin descripción"
          variant="outlined"
          margin="dense"
        />
        <Divider sx={{ my: 2 }} />
        {productos.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Productos del Pedido
            </Typography>
            {productos.map((articulo) => (
              <Box
                key={articulo.producto._id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography>{articulo.producto.nombreProducto}</Typography>
                <Box display="flex" alignItems="center">
                  <TextField
                    type="number"
                    min="0"
                    value={cantidades[articulo.producto._id] || ""}
                    onChange={(e) =>
                      handleCantidadChange(articulo.producto._id, e.target.value)
                    }
                    size="small"
                    variant="outlined"
                    sx={{ width: "80px", mr: 2 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => eliminarProducto(articulo.producto._id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => setIsModalOpen(true)}
          startIcon={<Add />}
        >
          Agregar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          startIcon={<Edit />}
        >
          Guardar
        </Button>
      </DialogActions>

      {/* Modal para agregar productos */}
      <AgregarModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        productosTienda={productosTienda}
        agregarProducto={agregarProducto}
      />
    </Dialog>
  );
};

export default EditarPedido;