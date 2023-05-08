//importamos el modulo Router desde express
//instanciamos clase Router con una variable
import { Router } from "express";
const router = Router();
import ProductManager from '../manager/products.manager.js';
const productManager = new ProductManager();
import { productValidator } from "../middlewares/productValidator.js";
import { uploader } from "../middlewares/multer.js";

router.get('/', async(req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getProducts(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        console.log(error);
    }
});

//consultar un producto
router.get('/:pid', async(req, res) =>{
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(Number(pid));
        if(product){
            res.status(200).json({ message: 'producto encontrado', product})
        } else {
            res.status(400).send('producto no encontrado')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//cargar un producto
router.post('/', productValidator, async(req, res) =>{
    try {
        console.log( req.body);
        const product = req.body;
        const newProduct = await productManager.createProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// cargar un producto con multer
router.post('/test-multer', uploader.single('thumbnail'), async(req, res) =>{
    try {
        console.log( req.file);
        const product = req.body;
        product.thumbnail = req.file.path;
        const newProduct = await productManager.createProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//modificar producto
router.put('/:pid', async(req, res) =>{
    try {
        const { name, price, stock } = req.body;
        const product = req.body;
        const { pid } = req.params;
        const productsFile = await productManager.getProductById(Number(pid));
        if(productsFile){
            await productManager.updateProduct(product, Number(pid));
            res.send('producto actualizado correctamente!!')
        } else {
            res.status(404).send('producto no encontrado')
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
}});

//eliminar un producto
router.delete('/:pid', async(req, res) =>{
    try {
        const { pid } = req.params;
        const products = await productManager.getProducts();  
        const productToDelete = products.find(prod => prod.pid === Number(pid));
        if(productToDelete) {
            await productManager.deleteProductById(Number(pid));
            res.send(`producto con id ${pid} eliminado con exito`);
        } else {
            res.send(`producto con id ${pid} no encontrado`)
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/', async(req, res) =>{
    try {
        await productManager.deleteAllProducts();
        res.send('productos eliminados exitosamente')
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default router;