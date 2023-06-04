import { Router } from 'express';
import CartManager from '../manager/cart.manager.js';
const router = Router();
const cartManager = new CartManager();

// Listar todos los carritos
router.get('/', async(req, res)=>{
  try {
    const cartFile = await cartManager.getCarts();
    res.status(200).json(cartFile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  };
});

// Listar los productos de un carrito con el cid proporcionado
router.get('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        res.status(400).send(`Carrito ${cid} no encontrado en router.`);
      } else {
        res.status(200).json(cart);
       }
    } catch (error) {
      res.status(404).json({message: error.message });
    }
  });

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart()
    res.status(200).json(newCart);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const productAdd = await cartManager.addProductToCart(pid, cid);
    if (productAdd) {
      res.status(200).send(`Producto con id: ${productAdd} agregado al carrito con éxito.`);
    } else {
      res.status(404).send(`Producto con id: ${pid} no encontrado.`);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  
  export default router;