// эта функция напрямую будет импортирована в маршруты (router)

const jwt = require('jsonwebtoken')
const {secret} = require('../config')

// доступ к этим функциям есть только у авторизованного пользователя
module.exports = function (req, res, next) {
    if(req.method === "OPTIONS"){
        next()
    }
    try{
        // токен передаёться в заголовке Authorization: Bearer <token> по этоме его следует достать
        // так как запрос являеться текстом его легко можно разбить на состояляющие, в данном сучае по пробелу
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            return res.status(403).json({message:"пользователь не приходил 1"})

        }
        // если токен в заголовке то декодируем его, тогда в нем лежит payload сформированный при генирации токена
        console.log("Ага попался! auth")

        const decodedData = jwt.verify(token, secret)
        // чтобы пользоваться этими данными в других функциях мы создаем поле user и добовляем туда эти данные
        req.user = decodedData
        next()
    }catch(e){
        console.log(e)
        return res.status(403).json({message:"пользователь не приходил 2"})
    }
}