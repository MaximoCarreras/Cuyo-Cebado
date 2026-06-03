import { Router } from 'express';

const router = Router();

router.post('/cotizar', async (req, res) => {
  try {
    const { codigoPostalDestino } = req.body;

    if (!codigoPostalDestino) {
      return res.status(400).json({ error: 'Falta el código postal de destino.' });
    }

    // 1. Nos autenticamos con Envíopack para obtener el Token de acceso temporal
    const authResponse = await fetch('https://api.enviopack.com/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "api-key": process.env.ENVIOPACK_API_KEY,
        "secret-key": process.env.ENVIOPACK_SECRET_KEY
      })
    });

    if (!authResponse.ok) {
      throw new Error('Falló la autenticación con Envíopack');
    }

    const authData = await authResponse.json();
    const token = authData.token;

    // 2. Armamos la consulta de cotización (Origen: Mendoza, Destino: el del cliente)
    // Usamos medidas estándar de una caja de mate (20x20x20cm, 1kg)
    const quoteResponse = await fetch(`https://api.enviopack.com/cotizar/costo?provincia=M&localidad=Mendoza&cp=5500&cp_destino=${codigoPostalDestino}&peso=1&volumen=0.008&bultos=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!quoteResponse.ok) {
      throw new Error('Error al cotizar con los transportes');
    }

    const opcionesDeEnvio = await quoteResponse.json();

    // 3. Le mandamos los precios a tu carrito en el frontend
    return res.status(200).json(opcionesDeEnvio);

  } catch (error) {
    console.error('❌ Error en el cotizador de envíos:', error);
    return res.status(500).json({ error: 'No se pudo calcular el envío en este momento.' });
  }
});

export default router;