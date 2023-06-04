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
            let cartGet = carts.find(cartIt => cartIt.id === cid);
            if(cartGet) {
                return cartGet
            }
            return false;
        } catch (error) {
            console.log(error);
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
    
    async findProdInCart(cid, pid) {
        try {
            const findCart = await this.getCartById(cid)
            if(findCart) {
                const products = findCart.products
                const findProducts = products.find(prodIt => prodIt.pid === pid);
                if (findProducts){
                    return findProducts;
                } else {
                    return null;
                }
            }else{
                return null
            }
        } catch (error) {
            console.log(error);            
        }
    }
    
    async addProductToCart(pid, cid) {
        try {
            //busco carrito y lo guardo en cart
            const prodFindInProducts = await productManager.getProductById(pid)
            console.log(prodFindInProducts)
            if(prodFindInProducts){
                const cartToAdd = await this.getCartById(cid)
                let carts = await this.getCarts();
                let productFound = await this.findProdInCart(cid, pid);
                if(productFound === null){
                    productFound = {
                        pid: pid,
                        quantity: 1
                    }
                    cartToAdd.products.push(productFound)
                } else {
                    productFound.quantity = productFound.quantity + 1
                    cartToAdd.products = cartToAdd.products.filter( prod => prod.pid !== pid)
                    cartToAdd.products.push(productFound)
                }
                carts = carts.filter(cart => cart.cid !== cid)
                carts.push(cartToAdd)
                await fs.promises.writeFile(this.pathCart, JSON.stringify(carts));
                return productFound.pid
            } else {
                return null;
            }
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
}
