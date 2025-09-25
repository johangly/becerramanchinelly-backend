import paypal from "@paypal/checkout-server-sdk";
import express from 'express';
import db from '../database/index.js';

const router = express.Router();

router.use(express.json());

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// endpoint para procesar el pago con paypal de la cita

router.post('/', async (req, res) => {
  try {
    const { appointmentId, clientName, clientEmail } = req.body;

    const appointment = await db.Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Cita no encontrada'
      });
    }


    const request = new paypal.orders.OrdersCreateRequest();

    request.requestBody({
      intent:'CAPTURE',
      purchase_units:[
        {
          amount:{
            currency_code:'MXN',
            value:'1000.00',
            breakdown:{
              item_total:{
                currency_code:'MXN',
                value:'1000.00',
              }
            }
          },
          items:[
            {
              name:"Asesoria legal para la fecha XXXX-XX-XX a las XXXX",
              description:'Reserva de cita',
              quantity:1,
              unit_amount:{
                currency_code:'MXN',
                value:'1000.00',
              }
            }
          ]
        }
      ]
    })

    const response = await client.execute(request);
    console.log('response:',response);
    // const appointment = await db.Appointment.findByPk(appointmentId);
    // if (!appointment) {
    //   return res.status(404).json({
    //     status: 'error',
    //     message: 'Cita no encontrada'
    //   });
    // }
    console.log('appointment conseguido:')
    // const createOrderRequest = new paypal.orders.OrdersCreateRequest();

    // createOrderRequest.requestBody({
    //   intent: 'CAPTURE',
    //   purchase_units: [
    //     {
    //       amount: {
    //         currency_code: 'USD',
    //         value: appointment.price.toString(),
    //       },
    //       description: 'Reserva de cita',
    //     },
    //   ],
    //   application_context: {
    //     return_url: `${process.env.FRONTEND_URL}/payment-success`,
    //     cancel_url: `${process.env.FRONTEND_URL}/`,
    //   },
    // });

    // const order = await client.execute(createOrderRequest);

    res.status(201).json({
      status: 'success',
      id: response.result.id,
      appointment: appointment,
      paypalOrderId: response.result.id,
      clientName: clientName,
      clientEmail: clientEmail,
    });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al procesar el pago',
      error: error.message
    });
  }
});

router.post('/manual-payment', async (req, res) => {
  try {

  } catch (error) {

  }
})


export default router;