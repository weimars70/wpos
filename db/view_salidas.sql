CREATE OR REPLACE VIEW public.view_salidas (
    codigo,
    fecha,
    ident,
    nombre,
    direccion,
    prefijo,
    factura,
    subtotal,
    descuento,
    iva,
    total,
    usuario,
    observaciones,
    vendedor,
    estado,
    tipo,
    forma_pago,
    plazo,
    saldo,
    anulado,
    empresa_id,
    empresa)
AS
SELECT a.codigo,
    a.fechahora::date AS fecha,
    a.tercero_ident AS ident,
    a.tercero_nombre AS nombre,
    a.tercero_direccion AS direccion,
    a.prefijo,
    a.factura,
    a.subtotal,
    a.descuento,
    a.iva,
    a.total,
    a.usuario,
    a.observaciones,
    a.vendedor::character varying AS vendedor,
    a.estado,
    b.nombre AS tipo,
    c.descripcion AS forma_pago,
    a.plazo,
    a.saldo,
        CASE
            WHEN a.anulado THEN 'SI'::text
            ELSE 'NO'::text
        END AS anulado,
    t.id AS empresa_id,
    t.nombre AS empresa
FROM public.salidas a
     JOIN public.salidas_tipo b ON a.tipo = b.id
     JOIN public.formas_pagos c ON c.codigo = a.forma_pago
     LEFT JOIN public.sec_users d ON d.login::text = a.vendedor
     JOIN public.empresas t ON t.id = a.empresa_id
ORDER BY a.codigo DESC;

ALTER VIEW public.view_salidas OWNER TO postgres;
