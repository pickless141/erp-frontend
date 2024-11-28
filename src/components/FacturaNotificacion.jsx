import { Badge, IconButton, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import socket from "../services/socket";

function FacturaNotificacion() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesPersistentes, setNotificacionesPersistentes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    socket.on("facturasVencidas", (facturas) => {
      setNotificaciones(facturas);
      setNotificacionesPersistentes((prev) => [...prev, ...facturas]);
    });

    return () => {
      socket.off("facturasVencidas");
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Icono de campanita con contador */}
      <IconButton color="inherit" onClick={handleOpenModal} className="ml-4">
        <Badge badgeContent={notificacionesPersistentes.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Modal con notificaciones */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Notificaciones de Facturas Vencidas</DialogTitle>
        <DialogContent dividers>
          {notificacionesPersistentes.length > 0 ? (
            <List>
              {notificacionesPersistentes.map((factura) => (
                <ListItem key={factura._id} divider>
                  <ListItemText
                    primary={`Cliente: ${factura.cliente.nombre}`}
                    secondary={`Tienda: ${factura.tienda.nombreTienda} | Vencimiento: ${new Date(
                      factura.fechaVencimiento
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p>No hay notificaciones pendientes.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FacturaNotificacion;