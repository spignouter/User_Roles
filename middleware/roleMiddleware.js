 // эта функция доступна только админу доступно только админу

const jwt = require("jsonwebtoken")
const { secret } = require("../config")

module.exports = function (roles){
  // используем замыкание
  return function (req, res, next){
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
        console.log("Ага попался! role")
        // трюк с переименованием теперь данные пейлоода хроняться в userRole
        const {roles:userRoles} = jwt.verify(token, secret)
        // переменная 
        let hasRole = false
        // С помощью цикла просмотрим все роли записанные у пользователя
        userRoles.forEach(role => {
          // если переданная роль соответствует той что записана в токене или есть у пользователя, то все ок, и пользователь может пользоваться функцией
          if(roles.includes(role)){
            hasRole = true
          }
        })
        if(!hasRole){
          return res.status(403).json({message:"Именно тебе это делать нельзя"})
        }

        next()
      }catch(e){
        console.log(e)
        return res.status(403).json({message:"пользователь не приходил 2"})
    }
  }
}