import fs from 'fs';
import Path from '../path.js';
const path = Path//agregue
import ProductManager from './products.manager.js';//agregue
const productManager = new ProductManager//agregue

// getAllCarts 
// createCart 
// getCartsbyId consultar un carrito igual al de products
// saveProductToCart guardar producto en un carrito


export default class CartManager {
    constructor() {//quite path como parametro
        this.pathCart = `${path}/api/carts.json`;//antes "this.path = path;"
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
                const carts = await fs.promises.readFile(this.pathCart, 'utf8');//antes "const carts = await fs.promises.readFile(this.path, 'utf8');"
                const productsCart = JSON.parse(carts);
                return productsCart
            } else {
                return []
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            const cart = await carts.find(cart => cart.cid === cid);
            if (cart) {
                return cart;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    // async createCart(obj) {
    //     try {
    //       const cart = {
    //         cid: await this.#getNextCartId() + 1,
    //         products: [],
    //         ...obj,
    //       };
    //       const cartsFile = await this.getCarts();
    //       cartsFile.push(cart);
    //       await fs.promises.writeFile(this.pathCarts, JSON.stringify(cartsFile));
    //       return cart;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }

      async createCart(cid){
        try {
            let newCart = [];
            if(cid){
                newCart = {
                    cid: await this.#getNextCartId() + 1,
                    products : []
                };
            }else{
                newCart = {
                    id: productManager.generateId(),
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

    

    // async createCart() {
    //     try {
    //         const cartsFile = await this.getCarts();
    //         const cid = cartsFile.length > 0 ? cartsFile[cartsFile.length - 1].cid + 1 : 1;
    //         const cart = {
    //             cid,
    //             products: []
    //         };
    //         cartsFile.push(cart);
    //         await fs.promises.writeFile(this.pathCart, JSON.stringify(cartsFile));
    //         return cart;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    


    // async createCart() {
    //     try {
    //          const cart = {
    //             cid: await this.#getNextCartId() + 1,
    //             products: []
    //         };
    //         const cartsFile = await this.getCarts();
    //         cartsFile.push(cart);
    //         await fs.promises.writeFile(this.pathCart, JSON.stringify(cartsFile));
    //         return cart;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async addProductToCart(pid, cid) {
        try {
            //busco carrito y lo guardo en cart
            const cart = await this.getCartById(cid);
            if (cart) {
                const productIndex = cart.products.findIndex(prod => prod.product === pid);
                if (productIndex !== -1) {
                    cart.products[productIndex].quantity += 1;
                } else {
                    cart.products.push({ product: pid, quantity: 1 });
                }
                const cartsFile = await this.getCarts();
                const index = cartsFile.findIndex(crt => crt.cid === cid);
                cartsFile[index] = cart;
                await fs.promises.writeFile(this.pathCart, JSON.stringify(cartsFile));
                return cart;
            }
            throw new Error(`Cart with id ${cid} not found`);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCartById(cid) {
        try {
            const cartsFile = await this.getCarts();
            if (cartsFile.length > 0) {
                const newArray = cartsFile.filter(crt => crt.cid !== cid);
                await fs.promises.writeFile(this.pathCart, JSON.stringify(newArray));
            } else {
                throw new Error(`Cart with id: ${cid} not found`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAllCarts() {
        try {
            if (fs.existsSync(this.pathCart)) {
                await fs.promises.unlink(this.pathCart);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
