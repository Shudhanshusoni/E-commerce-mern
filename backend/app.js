const express=require('express')
const app=express();
const cookie=require('cookie-parser');
const MiddleError=require('./middleware/error')
const bodyparser=require('body-parser');
const fileupload=require('express-fileupload')
const dotenv=require('dotenv')
const path=require('path');

dotenv.config({path:'backend/config/.env'});


app.use(express.json());
app.use(cookie());
app.use(bodyparser.urlencoded({extended:true}));
app.use(fileupload());

const product=require('./routes/productRoute')
const user=require('./routes/userRoute');
const order=require('./routes/orderRoute');
const payment=require('./routes/paymentRoute');

app.use('/api',product);
app.use('/api',user);
app.use('/api',order);
app.use('/api',payment);

app.use(MiddleError);

module.exports=app;