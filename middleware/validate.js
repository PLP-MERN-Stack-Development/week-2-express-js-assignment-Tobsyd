//middleware/validate.js
const { ValidationError } = require('./errorHandler');

exports.validateProduct = (req, res, next) => {
    const { name, description, price, category, inStock } = req.body;
    if(!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean'){
        return next(new ValidationError('Invalid product data'));
    }
    next();
};