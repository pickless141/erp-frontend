import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import Login from './views/Login';
import Home from './views/Home';
import Pedidos from './views/pedidos/Pedidos';
import Tiendas from './views/tiendas/Tiendas';
import Reposiciones from './views/reposiciones/Reposiciones';
import Productos from './views/productos/Productos';
import Producciones from './views/producciones/Producciones';
import NuevaTienda from './views/tiendas/NuevaTienda';
import NuevaProduccion from './views/producciones/NuevaProduccion';
import ClienteTiendaDetail from './views/clientes/ClienteTiendaDetail';
import EditarCliente from './views/clientes/EditarCliente';
import EditarTienda from './views/tiendas/EditarTienda';
import NuevoRegistro from './views/reposiciones/NuevoRegistro';
import Insumos from './views/insumos/Insumos';
import NuevoProducto from './views/productos/NuevoProducto';
import EditarProducto from './views/productos/EditarProducto';
import EditarInsumo from './views/insumos/EditarInsumo';
import NuevoInsumo from './views/insumos/NuevoInsumo';
import Detalle from './views/reposiciones/Detalle';
import DetalleTienda from './views/tiendas/DetalleTienda';
import PedidoForm from './views/tiendas/PedidoForm';
import ReposicionesTienda from './views/tiendas/ReposicionesTienda';
import NuevoPedido from './views/pedidos/NuevoPedido';
import PedidosTienda from './views/tiendas/PedidosTienda';
import EditarPedido from './views/pedidos/EditarPedido';
import Estadisticas from './views/estadisticas/Estadisticas';
import Facturacion from './views/facturacion/Facturacion';
import VentasEstadisticas from './views/estadisticas/VentasEstadisticas';
import ReposicionesEstadisticas from './views/estadisticas/ReposicionesEstadisticas';
import ProductosMasVendidos from './views/estadisticas/ProductoMasVendidos';
import ProductosMasVendidosPorTienda from './views/estadisticas/ProductosMasVendidosPorTienda';
import ProtectedRoute from './components/ProtectedRoute';
import UltimasReposiciones from './views/reposiciones/UltimasReposiciones';

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/:clienteId"
          element={
            <ProtectedRoute allowedRoles={['admin']} >
              <ClienteTiendaDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editarcliente/:clienteId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditarCliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pedidos"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <Pedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevopedido"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']} >
              <NuevoPedido />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar/:pedidoId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']} >
              <EditarPedido />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tiendas"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']} >
              <Tiendas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevatienda"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <NuevaTienda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editartienda/:tiendaId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <EditarTienda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tiendas/:id/detalle"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <DetalleTienda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reposiciones/tienda/:tiendaId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <ReposicionesTienda/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos/tienda/:tiendaId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <PedidosTienda/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hacerpedido/:tiendaId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <PedidoForm/>
            </ProtectedRoute>
          }
        />


        <Route
          path="/reposiciones"
          element={
            <ProtectedRoute allowedRoles={['admin', 'repositor', 'tercerizado', 'vendedor']}>
              <Reposiciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevoregistro"
          element={
            <ProtectedRoute allowedRoles={['admin', 'repositor', 'tercerizado']}>
              <NuevoRegistro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:reposicionId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'repositor', 'tercerizado', 'vendedor']}>
              <Detalle/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ultimas-reposiciones"
          element={
            <ProtectedRoute allowedRoles={['admin', 'repositor', 'tercerizado', 'vendedor']}>
              <UltimasReposiciones/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor', 'repositor', 'tercerizado']}>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevoproducto"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <NuevoProducto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editarproducto/:productoId"
          element={
            <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
              <EditarProducto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Estadisticas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas/ventas"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VentasEstadisticas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas/reposiciones"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReposicionesEstadisticas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas/producto-mas-vendido"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductosMasVendidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/estadisticas/productos-mas-vendidos-por-tienda"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductosMasVendidosPorTienda />
            </ProtectedRoute>
          }
        />

        <Route
          path="/facturacion"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Facturacion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/producciones"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Producciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevaproduccion"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NuevaProduccion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insumos"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Insumos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevoinsumo"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <NuevoInsumo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editarinsumo/:insumoId"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditarInsumo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;