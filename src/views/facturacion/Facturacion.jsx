import { Add } from "@mui/icons-material"; 
import Layout from "../../components/Layout";
import FacturaNotificacion from "../../components/FacturaNotificacion";
import FacturasList from "./FacturasList";
import CrearFacturaModal from "./CrearFacturaModal";
import { useFacturasStore } from "../../store";
import { useState } from "react";

function Facturacion() {
  const { fetchFacturas } = useFacturasStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl text-gray-800 font-light mb-6">Facturas</h1>

        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md w-12 h-12 shadow-md focus:outline-none"
            >
              <Add fontSize="large" />
            </button>
          </div>
          <FacturaNotificacion />
        </div>

        <FacturasList />

        <CrearFacturaModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshFacturas={fetchFacturas}
        />
      </div>
    </Layout>
  );
}

export default Facturacion;