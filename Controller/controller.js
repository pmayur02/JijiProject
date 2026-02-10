const service = require("../Service/service");


module.exports.register = async(req,res,next)=>{
    try {
        const payload = req.body;
        const response = await service.register(payload);
        res.status(response.statusCode).json(response);    

    } catch (error) {
        next(error)
    }
}

module.exports.login = async(req,res,next)=>{
    try {
        const payload = req.body;
        const response = await service.login(payload);
        res.status(response.statusCode).json(response);         
    } catch (error) {
        next(error)
    }
}

module.exports.askJiJi = async(req,res,next)=>{
    try {
        const payload = {user_id: req.user.id, ...req.body};
        const response = await service.askJiJi(payload);
        res.status(response?.statusCode).json(response); 
    } catch (error) {
        next(error)
    }
}