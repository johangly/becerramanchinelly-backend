// archivo donde se maneja la creacion de usuarios cuando clerk los cree
import db from '../database/index.js';
import { Webhook } from 'svix';
//import { Webhook as WebhookType } from '@clerk/clerk-sdk-node';

const { User } = db;

export const handleClerkWebhook = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('CLERK_WEBHOOK_SECRET no está configurado');
    }

    // Obtener los headers necesarios
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    // Si no hay headers, la petición no es de Clerk
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: 'Faltan headers requeridos' });
    }

    // Crear un nuevo webhook con el secreto
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
      // Verificar la firma del webhook
      evt = wh.verify(JSON.stringify(req.body), {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error al verificar el webhook:', err);
      return res.status(400).json({ error: 'Firma inválida' });
    }

    // Obtener el tipo de evento
    const eventType = evt.type;

    // Solo nos interesan los eventos de creación/actualización de usuario
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data;

      // Encontrar el email primario
      const primaryEmail = email_addresses.find(
        email => email.id === primary_email_address_id
      ) || email_addresses[0];

      if (!primaryEmail) {
        throw new Error('No se encontró un email para el usuario');
      }

      const email = primaryEmail.email_address;
      const name = `${first_name || ''} ${last_name || ''}`.trim() || email.split('@')[0];

      // Crear o actualizar el usuario
      const [user, created] = await User.upsert({
        cleark_id: id,
        name,
        email,
        role: 'user' // Rol por defecto
      });

      return res.status(200).json({
        success: true,
        message: created ? 'Usuario creado exitosamente' : 'Usuario actualizado exitosamente',
        user
      });
    }

    res.status(200).json({ success: true, message: 'Evento recibido pero no procesado' });
  } catch (error) {
    console.error('Error en el webhook de Clerk:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error al procesar el webhook'
    });
  }
};

export default handleClerkWebhook;