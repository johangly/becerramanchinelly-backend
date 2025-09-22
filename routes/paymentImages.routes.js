import express from 'express';
import db from '../database/index.js';

const router = express.Router();

router.use(express.json());

// Create a new payment image
router.post('/', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      payment_id,
      file_path,
      file_name,
      uploaded_by,
      is_active
    } = req.body;

    const paymentImage = await db.PaymentImages.create({
      payment_id,
      file_path,
      file_name,
      uploaded_by,
      is_active: null
    }, { transaction });

    await transaction.commit();
    res.status(201).json({
      status: 'success',
      data: paymentImage
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating payment image:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating payment image',
      error: error.message
    });
  }
});

// Read payment image by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paymentImage = await db.PaymentImages.findByPk(id);

    if (!paymentImage) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment image not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: paymentImage
    });
  } catch (error) {
    console.error('Error fetching payment image:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching payment image',
      error: error.message
    });
  }
});

// Update payment image
router.put('/:id', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const updates = req.body;

    const paymentImage = await db.PaymentImages.findByPk(id);

    if (!paymentImage) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment image not found'
      });
    }

    await paymentImage.update(updates, { transaction });
    await transaction.commit();

    res.status(200).json({
      status: 'success',
      data: paymentImage
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating payment image:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating payment image',
      error: error.message
    });
  }
});

// Delete payment image
router.delete('/:id', async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;

    const paymentImage = await db.PaymentImages.findByPk(id);

    if (!paymentImage) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment image not found'
      });
    }

    await paymentImage.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      status: 'success',
      message: 'Payment image deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting payment image:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting payment image',
      error: error.message
    });
  }
});

export default router;