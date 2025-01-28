import React, { useEffect, useState } from "react";
import useDepositoStore from "../../store/depositoStore";
import Layout from "../../components/Layout";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Deposito = () => {
  const { deposito, fetchDeposito, editCantidad } = useDepositoStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");

  useEffect(() => {
    fetchDeposito();
  }, [fetchDeposito]);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewCantidad(product.cantidad); 
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setNewCantidad("");
  };

  const handleSave = async () => {
    if (selectedProduct && newCantidad) {
      await editCantidad(selectedProduct._id, parseInt(newCantidad, 10));
      fetchDeposito(); 
      handleCloseDialog();
    }
  };

  if (!deposito || !deposito.productos) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Typography variant="h6" className="text-gray-500">
            Cargando...
          </Typography>
        </div>
      </Layout>
    );
  }

  if (deposito.productos.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Typography variant="h6" className="text-gray-500">
            No hay datos en el depósito.
          </Typography>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl text-gray-800 font-light">Depósito</h1>
        <span className="text-sm text-gray-600 mt-2 block">
          Aquí puedes ver los productos que hay en fábrica.
        </span>

        <Box
          className="bg-white rounded-lg shadow-md"
          sx={{
            maxHeight: "60vh",
            overflow: "auto",
            padding: "8px",
            marginTop: "12px",
          }}
        >
          <List>
            {deposito.productos.map((item, index) => (
              <React.Fragment key={item._id}>
                <ListItem
                  className="flex justify-between items-center"
                  sx={{
                    padding: "12px",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        className="font-medium text-gray-800"
                      >
                        {item.producto?.nombreProducto || "Sin nombre"}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" className="text-gray-500">
                        <strong>Cantidad:</strong> {item.cantidad} <span>Unidades</span>
                      </Typography>
                    }
                  />
                  <Tooltip title="Editar" arrow>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(item)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                {index < deposito.productos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>


        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
          <DialogTitle>Editar Cantidad</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              type="number"
              label="Nueva cantidad"
              value={newCantidad}
              onChange={(e) => setNewCantidad(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              disabled={!newCantidad || isNaN(newCantidad)}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Deposito;