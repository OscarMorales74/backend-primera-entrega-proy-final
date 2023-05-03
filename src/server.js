import express from 'express';
import morgan from 'morgan';
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/users.router.js';
import cartsRouter from './routes/carts.router.js';
import { __dirname } from './path.js';

const app = express();

// middleware globales
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public/images'));

//middleware local
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`server ok en puerto ${PORT}`);
})