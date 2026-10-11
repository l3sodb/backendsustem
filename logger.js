const requestlogger=(req,res,next) =>{
    console.log(`[${req.method}] ${req.url} ${res.statusCode}  ${new Date()}`);
    next();
} 
module.exports= requestlogger; 