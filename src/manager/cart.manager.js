import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async #getNextId() {
        let nextId = 0;
        const carts = await this.getCarts();
        carts.map((cart) => {
            if (cart.cid > nextId) nextId = cart.cid;
        });
        return nextId;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, 'utf8');
                return JSON.parse(carts);
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

    async createCart() {
        try {
            const cart = {
                cid: await this.#getNextId() + 1,
                products: []
            };
            const cartsFile = await this.getCarts();
            cartsFile.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async addProductToCart(pid, cid) {
        try {
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
                await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
                return cart;
            }
            throw new Error(`Cart with id ${cid} not found`);
        } catch (error) {
            console.log(error);
        }
    }

    // async deleteCartById(cid) {
    //     try {
    //         const cartsFile = await this.getCarts();
    //         if (cartsFile.length > 0) {
    //             const newArray = cartsFile.filter(crt => crt.cid !== cid);
    //             await fs.promises.writeFile(this.path, JSON.stringify(newArray));
    //         } else {
    //             throw new Error(`Cart with id: ${cid} not found`);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async deleteAllCarts() {
    //     try {
    //         if (fs.existsSync(this.path)) {
    //             await fs.promises.unlink(this.path);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}
