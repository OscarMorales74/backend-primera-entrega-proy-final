import fs from 'fs';
//agregue estas lineas
import Path from '../path.js'
const path = Path;

export default class ProductManager{
    constructor(){//cambie
        this.pathProducts = `${path}/api/products.json`;//cambie
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
            if(fs.existsSync(this.pathProducts)){//agregue Products a path
                const productsJSON = await fs.promises.readFile(this.pathProducts, 'utf8');//agregue Products a path y JSON a products
                const products = JSON.parse(productsJSON);//quite JSON a la variable products y lo agregue al parametro products
                if (limit) {
                    return products.slice(0, limit);//quite JSON a products
                } else {
                    return products;//quite JSON a products
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
            const product = products.find(prod => prod.pid == pid);
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
            await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));//agregue Products a path
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
            await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));//agregue Products a path
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProductById(pid){
        try {
            const productsFile = await this.getProducts();
            if(productsFile.length > 0){    
                const newArray = productsFile.filter(prod => prod.pid !== pid);
                await fs.promises.writeFile(this.pathProducts, JSON.stringify(newArray));//agregue Products a path
            } else {
                throw new Error(`Producto con id: ${pid} no encontrado`);
            }
        } catch (error) {
            console.log(error);
        }        
    }
    async deleteAllProducts(){
        try {
            if(fs.existsSync(this.pathProducts)){
                await fs.promises.unlink(this.pathProducts)//agregue Products a path 2 veces
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// import fs from 'fs';
// import Path from '../path.js';
// const path = Path;

// export default class ProductManager {
//   constructor() {
//     this.pathProducts = `${path}/api/products.json`;
//   }

//   async #getNextId() {
//     let nextId = 0;
//     const products = await this.getProducts();
//     products.forEach(prod => {
//       if (prod.pid > nextId) nextId = prod.pid;
//     });
//     return nextId;
//   }

//   async getProducts(limit) {
//     try {
//       if (fs.existsSync(this.pathProducts)) {
//         const productsJSON = await fs.promises.readFile(this.pathProducts, 'utf8');
//         const products = JSON.parse(productsJSON);
//         if (limit) {
//           return products.slice(0, limit);
//         } else {
//           return products;
//         }
//       } else {
//         return [];
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getProductById(pid) {
//     try {
//       const products = await this.getProducts();
//       const product = products.find(prod => prod.pid === pid);
//       if (product) {
//         return product;
//       }
//       return false;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async createProduct(obj) {
//     try {
//       const product = {
//         pid: await this.#getNextId() + 1,
//         ...obj
//       };
//       const productsFile = await this.getProducts();
//       productsFile.push(product);
//       await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
//       return product;
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async updateProduct(obj, pid) {
//     try {
//       const productsFile = await this.getProducts();
//       const index = productsFile.findIndex(prod => prod.pid === pid);
//       if (index === -1) {
//         throw new Error(`Id ${pid} no encontrada`);
//       } else {
//         productsFile[index] = { pid, ...obj };
//       }
//       await fs.promises.writeFile(this.pathProducts, JSON.stringify(productsFile));
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async deleteProductById(pid) {
//     try {
//       const productsFile = await this.getProducts();
//       if (productsFile.length > 0) {
//         const newArray = productsFile.filter(prod => prod.pid !== pid);
//         await fs.promises.writeFile(this.pathProducts, JSON.stringify(newArray));
//       } else {
//         throw new Error(`Producto con id: ${pid} no encontrado`);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async deleteAllProducts() {
//     try {
//       if (fs.existsSync(this.pathProducts)) {
//         await fs.promises.unlink(this.pathProducts);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
