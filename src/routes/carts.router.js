import { Router } from 'express';
const router = Router();
import CartManager from '../manager/cart.manager.js';
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



// Listar los productos del carrito con el cid proporcionado
router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    try {
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        res.status(404).send(`Cart with id ${cid} not found.`);
        return;
      }
      const products = await Promise.all(
        cart.products.map(async (product) => {
          const p = await productManager.getProductById(product.pid);
          return { ...product, ...p };
        })
      );
      res.json(products);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });

// Crear un nuevo carrito
router.post('/', async(req, res)=>{
  try {
      const newCart = await cartManager.createCart();
      res.status(201).json(newCart);
  } catch (error) {
      res.status(500).json({ message: error.message });
  };
});


  // Agregar un producto al carrito con el cid y pid proporcionados
router.post('/:cid/product/:pid', async (req, res) => {//antes "'/:cid/product/:pid'"
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    try {
      const cart = await cartManager.getCartById(cid);
      if (!cart) {
        res.status(404).send(`Cart with id ${cid} not found.`);
        return;
      }
      const product = await productManager.getProductById(pid);
      if (!product) {
        res.status(404).send(`Product with id ${pid} not found.`);
        return;
      }
      const index = cart.products.findIndex((p) => p.pid === pid);
      if (index === -1) {
        // Si el producto no existe en el carrito, lo agregamos con cantidad 1
        cart.products.push({ pid, quantity: 1 });
      } else {
        // Si el producto ya existe, incrementamos la cantidad en 1
        cart.products[index].quantity++;
      }
      await cartManager.updateCart(cart, cid);
      res.json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });
  
  export default router;