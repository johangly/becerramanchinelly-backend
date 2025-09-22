import db from '../database/index.js';

const { Currency } = db;

// Obtener todas las monedas
export const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll({
      order: [['is_default', 'DESC'], ['code', 'ASC']]
    });
    res.status(200).json({
      status: 'success',
      data: currencies
    });
  } catch (error) {
    console.error('Error al obtener monedas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener las monedas',
      error: error.message
    });
  }
};

// Obtener moneda activa
export const getActiveCurrency = async (req, res) => {
  try {
    const activeCurrency = await Currency.findOne({
      where: { is_active: true }
    });

    if (!activeCurrency) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay moneda activa configurada'
      });
    }

    res.status(200).json({
      status: 'success',
      data: activeCurrency
    });
  } catch (error) {
    console.error('Error al obtener moneda activa:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener la moneda activa',
      error: error.message
    });
  }
};

// Cambiar moneda activa
export const setActiveCurrency = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'Se requiere el ID de la moneda'
    });
  }

  const transaction = await db.sequelize.transaction();
  
  try {
    // Verificar si la moneda existe
    const currency = await Currency.findByPk(id, { transaction });
    
    if (!currency) {
      await transaction.rollback();
      return res.status(404).json({
        status: 'error',
        message: 'Moneda no encontrada'
      });
    }

    // Si ya está activa, no hacer nada
    if (currency.is_active) {
      await transaction.rollback();
      return res.status(200).json({
        status: 'success',
        message: 'La moneda ya está activa',
        data: currency
      });
    }

    // Desactivar todas las monedas
    await Currency.update(
      { is_active: false },
      { where: { is_active: true }, transaction }
    );

    // Activar la moneda seleccionada
    await Currency.update(
      { is_active: true },
      { where: { id }, transaction }
    );

    await transaction.commit();

    // Obtener la moneda actualizada
    const updatedCurrency = await Currency.findByPk(id);
    
    res.status(200).json({
      status: 'success',
      message: 'Moneda activada correctamente',
      data: updatedCurrency
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al cambiar moneda activa:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al cambiar la moneda activa',
      error: error.message
    });
  }
};

// Obtener moneda por ID
export const getCurrencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findByPk(id);
    
    if (!currency) {
      return res.status(404).json({
        status: 'error',
        message: 'Moneda no encontrada'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: currency
    });
  } catch (error) {
    console.error('Error al obtener moneda por ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener la moneda',
      error: error.message
    });
  }
};
