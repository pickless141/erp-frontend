import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ProductoModal from "./ProductoModal"; 

const DetalleTienda = ({ open, onClose, tiendaId }) => {
  const [tienda, setTienda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProductoModalOpen, setIsProductoModalOpen] = useState(false); 

  const fetchTiendaDetalle = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_SERVER;
      const response = await fetch(`${apiUrl}/tiendas/${tiendaId}/detalle`, {
        method: "GET",
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los detalles de la tienda");
      }

      const data = await response.json();
      setTienda(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchTiendaDetalle();
    }
  }, [open, tiendaId]);

  const handleOpenProductoModal = () => {
    setIsProductoModalOpen(true);
  };

  const handleCloseProductoModal = () => {
    setIsProductoModalOpen(false);
    fetchTiendaDetalle(); 
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Detalles de la Tienda
          <Tooltip title="Cerrar" arrow>
            <IconButton
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
              aria-label="Cerrar"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : tienda ? (
            <>
              <Typography variant="h6" gutterBottom>
                {tienda.nombreCliente} - {tienda.nombreTienda}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Dirección:</strong> {tienda.direccion}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Descripción:</strong> {tienda.descripcion}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Productos
              </Typography>
              <List>
                {tienda.productos.map((productoDetalle, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={productoDetalle.nombreProducto}
                      secondary={`Gs. ${productoDetalle.precio}`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography color="textSecondary" align="center">
              No se pudieron cargar los detalles de la tienda.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleOpenProductoModal}
            color="primary"
            variant="contained"
          >
            Añadir
          </Button>
        </DialogActions>
      </Dialog>

      {isProductoModalOpen && (
        <ProductoModal
          onClose={handleCloseProductoModal}
          tiendaId={tiendaId}
        />
      )}
    </>
  );
};

export default DetalleTienda;