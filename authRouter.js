const Router = require('express')
// роутер способный прослушивать запросы 
const router = new Router ()

// экспорт функций
const controller = require('./authController')

// подключаем валидатор
const {check} = require("express-validator")

// функция доступная для авторизованных пользователей
// const authMiddleware = require("./middleware/authMiddleware")

// доступно админу
const roleMiddleware = require("./middleware/roleMiddleware")

// встраиваем валидатор прямо в запрос
router.post('/registration',[
check('username', "Имя должно быть").notEmpty(),
check('password', "пароль короткий, а я люблю длинный").isLength({min:4})
], controller.registration)

router.post('/login', controller.login)

// закомментированный код использует только факт авторизации
// router.get('/users', authMiddleware ,controller.getUsers)

// этот код использует значения роли пользователя
router.get('/users', roleMiddleware(['USER','ADMIN']) ,controller.getUsers)
module.exports = router