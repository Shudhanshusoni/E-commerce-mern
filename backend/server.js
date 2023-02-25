const app=require('./app');
const dotenv=require('dotenv')
const cloudinary=require('cloudinary')
const path=require('path')
const express=require('express')


//uncaught Exception
process.on('uncaughtException',err=>{
    console.log(`Error:${err.message}`);
    console.log('server is shutDown due to uncaught Exception')
    process.exit(1);
})

const connectDB=require('./config/db');
dotenv.config({path:'backend/config/.env'});

connectDB();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../../frontend/build/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}
const PORT=process.env.PORT

const server=app.listen( PORT , () => {
    console.log(`server is connected to ${ PORT }`)
})

//unhandle Rejection
process.on('unhandledRejection',err=>{
    console.log(`Error:${err.message}`);
    console.log('server is shutDown due to unhandled Error')
    server.close(()=>{
        process.exit(1);
    });
})