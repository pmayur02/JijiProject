const supabase = require("../SupabaseConnection/supabaseConnection")

module.exports.authMiddleware = async(req,res,next)=>{
    try {
        const token = req?.headers?.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ error: 'No token Provided' });
        const { data, error } = await supabase.auth.getUser(token);
        if (error) return res.status(401).json({ error: 'Invalid token, You are unauthorised for this operation.' });
        req.user = data.user;
        next();
    } catch (error) {
        next(error);
    }
}
