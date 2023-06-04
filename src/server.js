import express from 'express';
import morgan from 'morgan';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
// import usersRouter from './routes/users.router.js';
import Path from './path.js';//antes "import { __dirname } from './path.js';"
import bodyParser from 'body-parser';   
import { errorhandler } from './middlewares/errorHandler.js';

const app = express();
const path = Path

// middleware globales
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(errorhandler);
app.use(express.static(path + '/public/images'));
app.use(bodyParser.urlencoded({ extended: true }));//agregue
app.use(bodyParser.json());//agregue

//middleware local
app.use('/api/products', productsRouter);
// app.use('/api/users', usersRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, ()=>{
    console.log(`server ok en puerto ${PORT}`);
})