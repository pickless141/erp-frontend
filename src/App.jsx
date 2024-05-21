import { Route, Router, Routes } from 'react-router-dom'
import Home from './views/Home'
import Login from './views/Login'
import Pedidos from './views/pedidos/Pedidos'
import './App.css'
import Tiendas from './views/tiendas/Tiendas'
import Reposiciones from './views/reposiciones/Reposiciones'
import Productos from './views/productos/Productos'
import NuevoCliente from './views/clientes/NuevoCliente'
import Producciones from './views/producciones/Producciones'
import NuevaTienda from './views/tiendas/NuevaTienda'
import NuevaProduccion from './views/producciones/NuevaProduccion'
import ClienteTiendaDetail from './views/clientes/ClienteTiendaDetail'
import EditarCliente from './views/clientes/EditarCliente'
import EditarTienda from './views/tiendas/EditarTienda'
import NuevoRegistro from './views/reposiciones/NuevoRegistro'
import Insumos from './views/insumos/Insumos'
import NuevoProducto from './views/productos/NuevoProducto'
import EditarProducto from './views/productos/EditarProducto'
import EditarInsumo from './views/insumos/EditarInsumo'
import NuevoInsumo from './views/insumos/NuevoInsumo'
import Detalle from './views/reposiciones/Detalle'
import DetalleTienda from './views/tiendas/DetalleTienda'
import PedidoForm from './views/tiendas/PedidoForm'
import ReposicionesTienda from './views/tiendas/ReposicionesTienda'
import DetalleReposicion from './views/tiendas/DetalleReposicion'
import NuevoPedido from './views/pedidos/NuevoPedido'
import PedidosTienda from './views/tiendas/PedidosTienda'
import DetallePedido from './views/tiendas/DetallePedido'
import EditarPedido from './views/pedidos/EditarPedido'

function App() {
  

  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      
      <Route path='/home' element={<Home/>}/>
      <Route path='/home/:clienteId' element={<ClienteTiendaDetail />} />
      <Route path='/nuevocliente' element={<NuevoCliente/>}/>
      <Route path='/editarcliente/:clienteId' element={<EditarCliente />} />
      
      <Route path='/pedidos' element={<Pedidos/>}/>
      <Route path='/nuevopedido' element={<NuevoPedido/>}/>
      <Route path='/editar/:pedidoId' element={<EditarPedido/>}/>

      <Route path='/tiendas' element={<Tiendas/>}/>
      <Route path='/nuevatienda' element={<NuevaTienda/>}/>
      <Route path='/editartienda/:tiendaId' element={<EditarTienda/>}/>
      <Route path='/tiendas/:id/detalle' element={<DetalleTienda/>}/>
      <Route path='/reposiciones/tienda/:tiendaId' element={<ReposicionesTienda/>}/>
      <Route path='/pedidos/tienda/:tiendaId' element={<PedidosTienda/>}/>
      <Route path="/reposiciones/:reposicionId/detalles-productos" element={<DetalleReposicion />} />
      <Route path="/pedidos/:pedidoId/resumenPedido" element={<DetallePedido />} />
      <Route path="/hacerpedido/:tiendaId" element={<PedidoForm />} />
      
      
      <Route path='/reposiciones' element={<Reposiciones/>}/>
      <Route path='/nuevoregistro' element={<NuevoRegistro/>}/>
      <Route path='/detail/:reposicionId' element={<Detalle/>}/>
      
      
      <Route path='/productos' element={<Productos/>}/>
      <Route path='/nuevoproducto' element={<NuevoProducto/>}/>
      <Route path='/editarproducto/:productoId' element={<EditarProducto/>}/>
      
      
      <Route path='/producciones' element={<Producciones/>}/>
      <Route path='/nuevaproduccion' element={<NuevaProduccion/>}/>
      
      <Route path='/insumos' element={<Insumos/>}/>
      <Route path='/nuevoinsumo' element={<NuevoInsumo/>}/>
      <Route path='/editarinsumo/:insumoId' element={<EditarInsumo/>}/>
      
    </Routes>
  )
}

export default App


