import { useEffect } from "react";
import Swal from "sweetalert2";
import { useFacturasStore, useGeneralStore } from "../../store";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Pagination from "../../components/Pagination";
import { format } from "date-fns";

function FacturasList() {
  const { facturas, fetchFacturas } = useFacturasStore();
  const { eliminarItem, currentPage, setCurrentPage } = useGeneralStore();

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "VENCIDO":
        return "#f44336";
      case "PENDIENTE":
        return "#2196f3";
      case "COBRADO":
        return "#4caf50";
      case "CANCELADO":
        return "#9e9e9e";
      default:
        return "#000000";
    }
  };

  const handleEliminarFactura = (facturaId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción. ¿Deseas eliminar la factura?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarItem("facturacion", facturaId, {
          onSuccess: fetchFacturas,
          onError: () => console.error("Error al eliminar la factura"),
        });
      }
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchFacturas(newPage);
  };

  return (
    <div>
      {/* Tabla compacta y responsiva */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm shadow-md">
          <thead className="bg-gray-800 text-white text-left">
            <tr>
              <th className="px-2 py-2 whitespace-nowrap">Cliente</th>
              <th className="px-2 py-2 whitespace-nowrap">Tienda</th>
              <th className="px-2 py-2 whitespace-nowrap">Estado</th>
              <th className="px-2 py-2 whitespace-nowrap">Vencimiento</th>
              <th className="px-2 py-2 whitespace-nowrap">Total</th>
              <th className="px-2 py-2 whitespace-nowrap">Método</th>
              <th className="px-2 py-2 text-center whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {facturas.map((factura) => (
              <tr
                key={factura._id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                  {factura.cliente.nombre}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                  {factura.tienda.nombreTienda}
                </td>
                <td
                  className="px-2 py-1 whitespace-nowrap font-bold"
                  style={{ color: getEstadoColor(factura.estado) }}
                >
                  {factura.estado}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-700">
                  {format(new Date(factura.fechaVencimiento), "dd/MM/yyyy")}
                </td>
                <td className="px-2 py-1 whitespace-nowrap text-gray-700 font-semibold">
                  Gs. {factura.total.toLocaleString()}
                </td>
                <td className="px-2 py-1 capitalize text-gray-700">
                  {factura.metodoPago}
                </td>
                <td className="px-2 py-1 text-center">
                  <IconButton
                    onClick={() => handleEliminarFactura(factura._id)}
                    className="text-red-500 hover:text-red-700"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        pageCount={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default FacturasList;