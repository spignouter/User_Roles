const Router = require('express')
// роутер способный прослушивать запросы 
const router = new Router ()

// экспорт функций
const controller = require('./authController')

// подключаем валидатор
const {check} = require("express-validator")


// встраиваем валидатор прямо в запрос
router.post('/registration',[
check('username', "Имя должно быть").notEmpty(),
check('password', "пароль короткий, а я люблю длинный").isLength({min:4})
], controller.registration)

router.post('/login', controller.login)
router.get('/users', controller.getUsers)

module.exports = router