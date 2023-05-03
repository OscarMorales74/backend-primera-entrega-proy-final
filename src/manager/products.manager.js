import fs from 'fs';

export default class ProductManager{
    constructor(path){
        this.path = path;
    }

    async #getNextId(){
        let nextId = 0;
        const products = await this.getProducts();
        products.map((prod) =>{
            if (prod.pid > nextId) nextId = prod.pid;
        });
        return nextId;
    }
    async getProducts(limit){
        try {
            if(fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path, 'utf8');
                const productsJSON = JSON.parse(products);
                if (limit) {
                    return productsJSON.slice(0, limit);
                } else {
                    return productsJSON;
                }
            } else {
                return []
            }            
        } catch (error) {
            console.log(error);
        }
    }
    async getProductById(pid){
        try {
            const products = await this.getProducts();
            const product = await products.find(prod => prod.pid === pid);
            if(product) {
                return product
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }
    async createProduct(obj){
        try {
            const product = {
                pid: await this.#getNextId() + 1,
                ...obj
            };
            const productsFile = await this.getProducts();
            productsFile.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(obj, pid){
        try {
            const productsFile = await this.getProducts();
            const index = productsFile.findIndex(prod => prod.pid === pid);
            console.log('index:::', index);
            if(index === -1){
                throw new Error(`Id ${pid} no encontrada`)
            } else {
                productsFile[index] = { pid, ...obj }
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProductById(pid){
        try {
            const productsFile = await this.getProducts();
            if(productsFile.length > 0){    
                const newArray = productsFile.filter(prod => prod.pid !== pid);
                await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            } else {
                throw new Error(`Producto con id: ${pid} no encontrado`);
            }
        } catch (error) {
            console.log(error);
        }        
    }
    async deleteAllProducts(){
        try {
            if(fs.existsSync(this.path)){
                await fs.promises.unlink(this.path)
            }
        } catch (error) {
            console.log(error);
        }
    }
}