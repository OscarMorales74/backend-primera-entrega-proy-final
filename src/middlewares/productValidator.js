//request ----> middleware ----> endpoint

export const productValidator = (req, res, next) => {
    const product = req.body;
    if (typeof product.price !== 'undefined' && !isNaN(product.price)) {
        next()
    } else {
        res.status(404).send('El precio no esta definido')
    }
}