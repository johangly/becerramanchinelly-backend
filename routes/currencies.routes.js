import { Router } from 'express';
import { 
  getAllCurrencies, 
  getActiveCurrency, 
  setActiveCurrency, 
  getCurrencyById 
} from '../controllers/currency.controller.js';

const router = Router();

/**
 * @swagger
 * /api/currencies:
 *   get:
 *     summary: Obtener todas las monedas
 *     tags: [Monedas]
 *     responses:
 *       200:
 *         description: Lista de monedas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Currency'
 */
router.get('/', getAllCurrencies);

/**
 * @swagger
 * /api/currencies/active:
 *   get:
 *     summary: Obtener la moneda activa actual
 *     tags: [Monedas]
 *     responses:
 *       200:
 *         description: Moneda activa actual
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: No hay moneda activa configurada
 */
router.get('/active', getActiveCurrency);

/**
 * @swagger
 * /api/currencies/{id}/activate:
 *   put:
 *     summary: Cambiar la moneda activa
 *     tags: [Monedas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la moneda a activar
 *     responses:
 *       200:
 *         description: Moneda activada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       400:
 *         description: Se requiere el ID de la moneda
 *       404:
 *         description: Moneda no encontrada
 */
router.put('/:id/activate', setActiveCurrency);

/**
 * @swagger
 * /api/currencies/{id}:
 *   get:
 *     summary: Obtener una moneda por ID
 *     tags: [Monedas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la moneda
 *     responses:
 *       200:
 *         description: Moneda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Currency'
 *       404:
 *         description: Moneda no encontrada
 */
router.get('/:id', getCurrencyById);

export default router;
