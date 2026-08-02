import { route } from 'quasar/wrappers';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/maestros/medios-pago', component: () => import('pages/maestros/MediosPagoPage.vue') },
      { path: '/maestros/colores', component: () => import('pages/maestros/ColoresPage.vue') },
      { path: '/maestros/documentos', component: () => import('pages/maestros/DocumentosPage.vue') },
      { path: '/maestros/empleados', component: () => import('pages/maestros/EmpleadosPage.vue') },
      { path: '/maestros/grupos-items', component: () => import('pages/maestros/GruposItemsPage.vue') },
      { path: '/maestros/tipo-iva', component: () => import('pages/maestros/TipoIvaPage.vue') },
      { path: '/maestros/tallas', component: () => import('pages/maestros/TallasPage.vue') },
      { path: '/maestros/items', component: () => import('pages/maestros/ItemsPage.vue') },
      { path: '/maestros/proveedores', component: () => import('pages/maestros/ProveedoresPage.vue') },
      { path: '/maestros/clientes', component: () => import('pages/maestros/ClientesPage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: '/salidas/facturas', component: () => import('pages/salidas/FacturasPage.vue') },
      { path: '/salidas/listado-facturas', component: () => import('pages/salidas/ListadoFacturasPage.vue') },
      
      // Entradas
      { path: '/entradas/listado-compras', component: () => import('pages/entradas/ListadoComprasPage.vue') },
      { path: '/entradas/nueva-compra', component: () => import('pages/entradas/NuevaCompraPage.vue') },
      { path: '/entradas/listado-cxp', component: () => import('pages/entradas/ListadoCXPPage.vue') },
      { path: '/entradas/movimiento-facturas', component: () => import('pages/entradas/MovimientoFacturasPage.vue') },
      
      // Inventario
      { path: '/inventario/ajuste', component: () => import('pages/inventario/AjusteInventarioPage.vue') },
      { path: '/inventario/general', component: () => import('pages/inventario/InventarioGeneralPage.vue') },
      { path: '/inventario/listado-ajustes', component: () => import('pages/inventario/ListadoAjustesPage.vue') },
      { path: '/inventario/listado-inventario', component: () => import('pages/inventario/ListadoInventarioPage.vue') },
      { path: '/inventario/items-sin-inventario', component: () => import('pages/inventario/ItemsSinInventarioPage.vue') },
      { path: '/inventario/listado-traslados', component: () => import('pages/inventario/ListadoTrasladosPage.vue') },
      { path: '/inventario/movimiento-items', component: () => import('pages/inventario/MovimientoItemsPage.vue') },
      { path: '/inventario/movimiento-items-filtrar', component: () => import('pages/inventario/MovimientoItemsFiltrarPage.vue') },
      { path: '/inventario/recibir-traslado', component: () => import('pages/inventario/RecibirTrasladoPage.vue') },
      { path: '/inventario/valor-inventario', component: () => import('pages/inventario/ValorInventarioPage.vue') },
      { path: '/inventario/traslado-inventario', component: () => import('pages/inventario/TrasladoInventarioPage.vue') },
    ],

  },
  { path: '/:catchAll(.*)*', redirect: '/login' },
];

export default route(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory(),
  });

  Router.beforeEach((to) => {
    const token = localStorage.getItem('token');
    if (!to.meta.public && !token) return { path: '/login' };
    if (to.path === '/login' && token) return { path: '/dashboard' };
  });

  return Router;
});
