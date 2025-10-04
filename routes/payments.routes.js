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

router.delete('/delete-payment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await db.PaymentsAppointments.findAll({
      where: { id }
    });
    console.log(payment)
    if(payment[0].status==='reembolso' || payment[0].status==='reembolsado'){
      return res.status(400).json({
        status: 'error',
        message: 'Payment already refunded'
      });
    }
    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }
    const paymentDeleted = await db.PaymentsAppointments.update({
      status: 'reembolso'
    }, {
      where: { id: id }
    });
    const updatedStatusAppointment = await db.Appointment.update({
      status: 'disponible'
    }, {
      where: { id: payment[0].appointment_id }
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting payment',
      error: error.message
    });
  }
})


export default router;