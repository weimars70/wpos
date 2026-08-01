-- Agrega empresa_id a la vista para permitir filtrar por sucursal
CREATE OR REPLACE VIEW public.view_items_inventario AS
SELECT a.item,
    a.descripcion,
    a.grupo_codigo,
    b.descripcion AS grupo,
    a.por_iva,
    a.por_ganmin,
    a.por_ganmax,
    a.activo,
    a.item_tipo_iva,
    c.descripcion AS tipo_iva,
    a.imagen,
    a.ult_pcompra,
    a.ult_pventa,
    i.talla,
    i.color AS cod_color,
    k.nombre AS color,
    i.unidades,
    (i.unidades * a.ult_pcompra)::numeric(12,2) AS t_compra,
    (i.unidades * a.ult_pventa)::numeric(12,2) AS t_venta,
    i.empresa_id
FROM items a
     JOIN items_grupos b ON a.grupo_codigo = b.codigo
     JOIN items_tipo_iva c ON a.item_tipo_iva = c.codigo
     JOIN inventario i ON a.item = i.item
     JOIN colores k ON i.color = k.id;

ALTER VIEW public.view_items_inventario OWNER TO postgres;
