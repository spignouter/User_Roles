const jwt = require('jsonwebtoken')

const 

// доступ к этим функциям есть только у администратор 
module.exports = function (req, res, next) {
    if(req.method === "OPTIONS"){
        next()
    }
    try{
        // токен передаёться в заголовке Authorization: Bearer <token> по этоме его следует достать
        // так как запрос являеться текстом его легко можно разбить на состояляющие, в данном сучае по пробелу
        const token = req.headers.authorization.split('')[1]
        if(!token){
            return res.status(403).json({message:"пользователь не приходил"})

        }
        // если токен в заголовке то декодируем его
        const decodedDate = jwt.verify(token, )
    }catch(e){
        console.log(e)
        return res.status(403).json({message:"пользователь не приходил"})
    }
}