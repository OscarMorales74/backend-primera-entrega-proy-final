//request ----> middleware ----> endpoint

export const productValidator = (req, res, next) => {
    const product = req.body;
    if (typeof product.title !== 'string' || product.title === undefined || product.title === '') {
        res.status(404).send('product title no valid');
    } else {
        if (typeof product.description !== 'string' || product.description === undefined || product.description === '') {
            res.status(404).send('product description no valid');
        } else {
            if (typeof product.price !== 'number' || product.price === undefined || product.price === 0) {
                res.status(404).send('product price no valid');
            } else {
                if (typeof product.status !== 'boolean' || product.status === undefined || product.status === '') {
                    res.status(404).send('product status no valid');
                } else {
                    if (typeof product.stock !== 'number' || product.stock === undefined || product.stock === 0) {
                        res.status(404).send('product stock no valid');
                    } else {
                        if (typeof product.category !== 'string' || product.category === undefined || product.category === '') {
                            res.status(404).send('product category no valid');
                        } else {
                            next()
                        }
                    }
                }
            }
        }
    }
}