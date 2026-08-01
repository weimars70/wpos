-- Actualiza func_registra_salida para leer empresa_id en vez de sucursal desde el JSON
-- Las columnas de las tablas (sucursal) NO cambian, solo los nombres de campo en el JSON de entrada.

CREATE OR REPLACE FUNCTION public.func_registra_salida(
    i_enc text,
    i_det text,
    i_detpagos text)
  RETURNS integer
  LANGUAGE plpgsql
AS $body$
DECLARE

V_DETALLE TEXT;

V_DETALLE_PAGOS TEXT;

V_ENC JSON;

V_DET JSON;

V_DET_PAGOS JSON;

V_RA JSON;

V_CODIGO INTEGER;

V_FECHA DATE;

V_PREFIJO TEXT;

V_FACTURA INTEGER;

V_REMISION INTEGER;

V_SUCURSAL INTEGER;

BEGIN

   i_enc = REPLACE(i_enc::text, '\', '' );

   i_det = REPLACE(i_det::text, '\', '' );



   V_REMISION=0;



  FOR V_RA IN SELECT * FROM json_array_elements(i_enc)

  LOOP

  	V_ENC=V_RA;

  END LOOP;



  -- empresa_id en el JSON corresponde a la sucursal/bodega en las tablas
  SELECT INTO V_PREFIJO facturas_prefijo FROM tiendas where id=(V_ENC->>'empresa_id')::INTEGER;



   SELECT INTO V_DETALLE substring(i_det from POSITION('[' in i_det) for length(i_det));



   V_DETALLE = REPLACE(V_DETALLE,  '\\', '' );

   V_DETALLE= substring(V_DETALLE FROM 1 for length(V_DETALLE)-2);

   V_DET = V_DETALLE::JSON;



   IF i_detpagos IS NOT NULL AND i_detpagos <> '' THEN

       i_detpagos = REPLACE(i_detpagos::text, '\', '' );

   END IF;



   IF i_detpagos IS NOT NULL AND i_detpagos <> '[]' AND i_detpagos <> '' THEN

     SELECT INTO V_DETALLE_PAGOS substring(i_detpagos from POSITION('[' in i_detpagos) for length(i_detpagos));

     V_DETALLE_PAGOS = REPLACE(V_DETALLE_PAGOS,  '\\', '' );

     V_DETALLE_PAGOS= substring(V_DETALLE_PAGOS FROM 1 for length(V_DETALLE_PAGOS)-2);

     V_DET_PAGOS = V_DETALLE_PAGOS::JSON;

  END IF;



 -- Incrementa y devuelve el codigo de la salida
 UPDATE secuencias SET valor=valor+1 WHERE nombre='salidas' AND sucursal=(V_ENC->>'empresa_id')::INTEGER RETURNING valor INTO V_CODIGO;

 V_SUCURSAL =(V_ENC->>'empresa_id')::INTEGER;

 IF (V_ENC->>'tipo')::INTEGER IN (1,3) THEN

   UPDATE secuencias SET valor=valor+1 WHERE nombre='facturas' AND sucursal=(V_ENC->>'empresa_id')::INTEGER RETURNING valor INTO V_FACTURA;

 ELSE

 	UPDATE secuencias SET valor=valor+1 WHERE nombre='remisiones' AND sucursal=(V_ENC->>'empresa_id')::INTEGER RETURNING valor INTO V_REMISION;

 	V_FACTURA = 0;

 END IF;

-- INSERTA ENCABEZADO

INSERT INTO

  public.salidas(codigo,tercero_ident,tercero_nombre,tercero_direccion,

  prefijo,factura,forma_pago,plazo,subtotal,descuento,iva,total,vendedor,tipo,sucursal,remision)

	VALUES (V_CODIGO,V_ENC->>'ident',V_ENC->>'nombre',V_ENC->>'direccion',V_PREFIJO,V_FACTURA,(V_ENC->>'forma_pago')::INTEGER

	,(V_ENC->>'plazo')::INTEGER ,(V_ENC->>'subtotal')::NUMERIC,(V_ENC->>'descuento')::NUMERIC,(V_ENC->>'iva')::NUMERIC,(V_ENC->>'total')::NUMERIC

    ,(V_ENC->>'vendedor'),(V_ENC->>'tipo')::INTEGER,(V_ENC->>'empresa_id')::INTEGER ,V_REMISION);

-- INSERTA DETALLE

 FOR V_RA IN SELECT * FROM json_array_elements(V_DET)

 	LOOP

    	IF (V_RA->>'color') IS NULL OR (V_RA->>'color')::INTEGER <1 THEN

        	RAISE EXCEPTION '@COLOR INVALIDO@';

        END IF;


        IF (V_RA->>'talla') IS NULL OR (V_RA->>'talla')= '' THEN

        	RAISE EXCEPTION '@TALLA INVALIDA@';

        END IF;

    	INSERT INTO public.salidas_detalle (codigo,item,item_descripcion,por_iva,color,talla, pventa,por_descuento,

  		pvfinal,pvfinaliva,unidades,subtotal,sucursal)

        VALUES (V_CODIGO,(V_RA->>'item'), V_RA->>'nombre', (V_RA->>'por_iva')::NUMERIC,(V_RA->>'color')::INTEGER

        ,(V_RA->>'talla'),

       (V_RA->>'pventa')::NUMERIC,(V_RA->>'pdesc')::NUMERIC

        ,(V_RA->>'pvfinal')::NUMERIC,(V_RA->>'pvfinaliva')::NUMERIC,(V_RA->>'cantidad')::INTEGER

        ,(V_RA->>'subtotal')::NUMERIC ,(V_ENC->>'empresa_id')::INTEGER );

      END LOOP;


 INSERT INTO

  public.salidas_movimientos(codigo_salida,debito,credito, efectivo, cambio,sucursal)

VALUES (V_CODIGO, (V_ENC->>'total')::NUMERIC,0,0,0,(V_ENC->>'empresa_id')::INTEGER);

IF (V_ENC->>'forma_pago')::INTEGER = 1 THEN

        INSERT INTO

        public.salidas_movimientos(codigo_salida,debito,credito, efectivo, cambio,sucursal,medio_pago)

      VALUES (V_CODIGO, 0,(V_ENC->>'total')::NUMERIC,(V_ENC->>'efectivo')::NUMERIC

      ,(V_ENC->>'cambio')::NUMERIC,(V_ENC->>'empresa_id')::INTEGER, 1);

END IF;

IF (V_ENC->>'forma_pago')::INTEGER NOT IN ( 1,5) THEN

	INSERT INTO

    public.salidas_movimientos(codigo_salida,debito,credito, efectivo, cambio,sucursal,medio_pago)

  VALUES (V_CODIGO, 0,(V_ENC->>'total')::NUMERIC,0,0,(V_ENC->>'empresa_id')::INTEGER,(V_ENC->>'forma_pago')::INTEGER);

END IF;

IF i_detpagos IS NOT NULL AND i_detpagos <> '[]' AND i_detpagos <> '' THEN

 FOR V_RA IN SELECT * FROM json_array_elements(V_DET_PAGOS)

 	LOOP

        INSERT INTO

        public.salidas_movimientos(codigo_salida,debito,credito, efectivo, cambio,sucursal,medio_pago, nota)

      	VALUES (V_CODIGO, 0,(V_RA->>'valor_pago')::NUMERIC,0,0,(V_ENC->>'empresa_id')::INTEGER,

        (V_RA->>'fpago')::INTEGER,(V_RA->>'nro_nota')::INTEGER);



        IF (V_RA->>'fpago')::INTEGER=5 THEN

        	Update notas set saldo=saldo-(V_RA->>'valor_pago')::NUMERIC

            WHERE sucursal=(V_ENC->>'empresa_id')::INTEGER AND nro_nota = (V_RA->>'nro_nota')::INTEGER;

        END IF;

      END LOOP;

END IF;

RETURN V_CODIGO;

END;
$body$;
