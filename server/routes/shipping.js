import { Router } from 'express';

const router = Router();

router.post('/cotizar', async (req, res) => {
  try {
    const { codigoPostalDestino } = req.body;

    if (!codigoPostalDestino) {
      return res.status(400).json({ error: 'Falta el código postal de destino.' });
    }

    // 1. Nos autenticamos con Envíopack
    const authResponse = await fetch('https://api.enviopack.com/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "api-key": process.env.ENVIOPACK_API_KEY,
        "secret-key": process.env.ENVIOPACK_SECRET_KEY
      })
    });

    if (!authResponse.ok) throw new Error('Falló la autenticación con Envíopack');
    
    const authData = await authResponse.json();
    const token = authData.token;

    // 2. Cotizamos usando SOLO el CP de destino, peso (1kg) y volumen
    // El origen lo toma de tu cuenta de Envíopack automáticamente
    const quoteUrl = `https://api.enviopack.com/cotizar/costo?cp=${codigoPostalDestino}&peso=1&volumen=0.008&bultos=1`;
    
    const quoteResponse = await fetch(quoteUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!quoteResponse.ok) throw new Error('Error al cotizar con los transportes');

    const opcionesDeEnvio = await quoteResponse.json();

    // Imprimimos en la consola de Render para ver qué responde exactamente Envíopack
    console.log("Respuesta de Envíopack:", opcionesDeEnvio);

    // 3. Devolvemos las opciones al frontend
    return res.status(200).json(opcionesDeEnvio);

  } catch (error) {
    console.error('❌ Error en el cotizador:', error);
    return res.status(500).json({ error: 'No se pudo calcular el envío.' });
  }
});

export default router;