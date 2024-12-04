import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Typography,
  TextField,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const PedidoForm = ({ open, onClose, tiendaId }) => {
  const [tienda, setTienda] = useState({ nombreTienda: "", productos: [] });
  const [pedido, setPedido] = useState([]);
  const apiUrl = import.meta.env.VITE_API_SERVER;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (open && tiendaId) {
      const fetchTiendaDetalle = async () => {
        try {
          const response = await fetch(`${apiUrl}/tiendas/tienda/${tiendaId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
          });

          if (!response.ok) {
            throw new Error("Error al obtener los detalles de la tienda");
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
    }
  }, [open, tiendaId, apiUrl, token]);

  const handleCantidadChange = (index, cantidad) => {
    const nuevoPedido = [...pedido];
    nuevoPedido[index].cantidad = Number(cantidad);
    setPedido(nuevoPedido);
  };

  const handleConfirmarPedido = async () => {
    const pedidoParaEnviar = pedido.filter((item) => item.cantidad > 0);

    if (pedidoParaEnviar.length === 0) {
      Swal.fire(
        "Pedido vacío",
        "No puedes confirmar un pedido sin productos.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          tiendaId,
          productos: pedidoParaEnviar,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar el pedido");
      }

      Swal.fire(
        "Pedido confirmado",
        "El pedido ha sido confirmado con éxito.",
        "success"
      );
      onClose(); 
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Pedido para {tienda.nombreTienda}
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Cantidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tienda.productos.map((producto, index) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>Gs. {producto.precio}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={pedido[index]?.cantidad || 0}
                      onChange={(e) =>
                        handleCantidadChange(index, e.target.value)
                      }
                      size="small"
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleConfirmarPedido}>
          Confirmar 
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PedidoForm;