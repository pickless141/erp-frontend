import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ResumenPedidoModal = ({ open, onClose, pedidoId }) => {
  const [productos, setProductos] = useState([]);
  const [nombreTienda, setNombreTienda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && pedidoId) {
      setLoading(true);
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_SERVER;

      fetch(`${apiUrl}/pedidos/${pedidoId}/resumen`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            Swal.fire("Error", data.error, "error");
          } else {
            setProductos(data.pedidos || []);
            setNombreTienda(data.tienda ? data.tienda.nombre : "");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching resumen del pedido:", error);
          Swal.fire("Error", "Error al cargar el resumen del pedido", "error");
          setLoading(false);
        });
    }
  }, [open, pedidoId]);

  useEffect(() => {
    if (!open) {
      setProductos([]);
      setNombreTienda("");
      setLoading(true);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Resumen del Pedido
        <Button
          onClick={onClose}
          color="error"
          startIcon={<Close />}
          sx={{ position: "absolute", right: 16, top: 16 }}
        >
          Cerrar
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Tienda: {nombreTienda || "Sin nombre de tienda"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {productos.length > 0 ? (
              <List>
                {productos.map((articulo, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`Producto: ${articulo.producto}`}
                      secondary={`Cantidad: ${articulo.cantidad}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hay productos en este pedido.
              </Typography>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumenPedidoModal;