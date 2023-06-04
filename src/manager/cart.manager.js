import fs from 'fs';
import Path from '../path.js';
import ProductManager from './products.manager.js';
const path = Path
const productManager = new ProductManager

export default class CartManager {
    constructor() {
        this.pathCart = `${path}/api/carts.json`;
    }

    async #getNextCartId() {
        let nextId = 0;
        const carts = await this.getCarts();
        carts.map((cart) => {
            if (cart.cid > nextId) nextId = cart.cid;
        });
        return nextId;
    }
    
    async getCarts() {
        try {
            if (fs.existsSync(this.pathCart)) {
                const productsCartJSON = await fs.promises.readFile(this.pathCart, 'utf-8');
                const productsCart = JSON.parse(productsCartJSON);
                return productsCart
            } else {
                await fs.promises.writeFile(this.pathCart, JSON.stringify([]));
                const productsCartJSON = await fs.promises.readFile(this.pathCart, 'utf-8');
                const productsCart = JSON.parse(productsCartJSON);
                return productsCart
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            let cartGet = carts.find(cartIt => cartIt.cid == cid);
            if (cartGet) {
                return cartGet;
            } else {
                throw new Error(`Carrito ${cid} no encontrado en manager.`);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async createCart(newcid){
        try {
            let newCart = [];
            if(newcid) {
                newCart = {
                    cid: newcid,
                    products: []
                };
            } else {
                newCart = {
                    cid: await this.#getNextCartId() + 1,
                    products : []
                };
            }            
            const cartsFile = await this.getCarts();
            cartsFile.push(newCart);
            await fs.promises.writeFile(this.pathCart, JSON.stringify(cartsFile));
            return newCart;
        } catch (error) {
            console.log(error)
        }
    }
        
    async addProductToCart(pid, cid) {
        try {
          const prodFindInProducts = await productManager.getProductById(pid);
          if (prodFindInProducts) {
            let carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.cid === parseInt(cid));
      
            if (cartIndex === -1) {
              // El carrito no existe, se crea uno nuevo
              const newCart = {
                cid: parseInt(cid),
                products: [
                  {
                    pid: pid,
                    quantity: 1
                  }
                ]
              };
              carts.push(newCart);
            } else {
              // El carrito existe, se agrega o actualiza el producto
              const cart = carts[cartIndex];
              const productIndex = cart.products.findIndex(prod => prod.pid === pid);
      
              if (productIndex === -1) {
                // El producto no está en el carrito, se agrega
                cart.products.push({
                  pid: pid,
                  quantity: 1
                });
              } else {
                // El producto ya está en el carrito, se actualiza la cantidad
                cart.products[productIndex].quantity += 1;
              }
            }
      
            await fs.promises.writeFile(this.pathCart, JSON.stringify(carts));
            return pid;
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
        }
      }
}
