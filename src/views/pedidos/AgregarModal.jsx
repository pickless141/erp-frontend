import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";

const AgregarModal = ({ isOpen, setIsOpen, productosTienda, agregarProducto }) => {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Seleccionar Producto</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Seleccione los productos que desea agregar al pedido:
        </Typography>
        {productosTienda.length > 0 ? (
          <List>
            {productosTienda.map((producto) => (
              <ListItem
                key={producto._id}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => agregarProducto(producto)}
                    color="primary"
                  >
                    <FaPlus />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${producto.nombreProducto}`}
                  secondary={`Precio: ${producto.precio} Gs.`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No hay productos disponibles.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOpen(false)} color="error" variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgregarModal;