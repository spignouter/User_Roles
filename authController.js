// модели для запросов в базу данных
const User = require('./models/User')
const Role = require('./models/Role')

// модуль для хеширования пароля
const bcrypt = require('bcryptjs')

// модуль для json веб-токена
const jwt = require('jsonwebtoken')
// секретный ключ
const {secret} = require('./config')
// создание функции веб-токена, тело токена это payload в нем содержаться ид и роль пользователя, эти данные шифруються в json веб-токен
const generationAccessToken = (id, roles) =>{
    const payload = {
        id, 
        roles
    }
    return jwt.sign(payload,secret, {expiresIn:"24h"} )
}
// валидация, эта функция ответственна за ошибки при проверки валидации
const {validationResult} = require('express-validator')

// Здесь будут описанны все функции для работы с пользователями этот фаил напрямую зависит от маррутов
class authController {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    async registration(req, res){
        try{
            // перед началом выполнения функции получаем ошибки
            // передать необходимо запрос от клиента
            const errors = validationResult(req)

            // если массив ошибок не пустой, то возвращаем ошибку на клиент
            if(!errors.isEmpty()){
                return res.status(400).json({massage:"Ошибки при регистрации", errors})
            }
            // вытаскиваем данные из запроса самая загодочная строка, почему мы смотрим содержимое запроса на сервер, а может быть потому что, клиент проходя по маршруту запускает выполниния мидла, который смотрит пришедший запрос пользователя и достаёт от туда данные через req.body
            const {username, password} = req.body
            // ищем в базе введеное имя, если такое имя уже есть то добовлять его не следует
            const candidate = await User.findOne({username})
            // если candidate не пустой то создаём пользователя
            if(candidate){
                return res.status(400).json({massage:"Такой уже тут"})
            }
            // создание хешированого пароля
            const hashPassword = bcrypt.hashSync(password, 6)
            // получение данных прав доступа из базы данных, именно здесь вабираеться роль пользователя при создании {value:"USER"} или {value:"ADMIN"}
            const userRole = await Role.findOne({value:"ADMIN"})
            console.log(userRole)
            // создание нового пользователя в перую очередь получаем получам его имя, получаем хеш паролья, и назначаем пользователю роль
            const user = new User({username, password: hashPassword, roles:[userRole.value]})                                                                                                                                                                                                                                                                                                                                                   
            // в конце сохроняем 
            user.save()
            return res.json({message: "Ты справился, скажи себе, молодец"})
        }catch(e){
            console.log(e)
            res.status(400).json({message:'Ошибочка такая'})
        }
    }
    async login(req, res){
        try{
            // получаем данные из запроса клиента
            const {username, password} = req.body
            // находим данные в базе данных, тоесть записываем в переменную
            const user = await User.findOne({username})
            // проверка, найден ли такой пользователь
            if(!user){
                return res.status(400).json({massage:`Тебя (${username}) тут ни когда не было!`})
            }
            // сравниваем пароли эту операцию можно можно провести с помощью функции bcrypt.compareSync
            const validPassword = bcrypt.compareSync(password, user.password)
            // Проверка на совпадение паролей
            console.log(password)
            console.log( user.password)
            console.log( validPassword)

            if(!validPassword){
                return res.status(400).json({massage:`Твой пароль, явно не твой`})
            }
            // генирация веб-токена, с помощью самописной функции
            const token = generationAccessToken(user._id, user.roles)
            return res.json({token})
        }catch(e){
            console.log(e)
            res.status(400).json({message:'Ошибочка этакая'})            
        }
    }
    async getUsers(req, res){
        try{
            // const userRole = new Role()
            // const adminRole = new Role({value:"ADMIN"})
            // await userRole.save()
            // await adminRole.save()

            // res.send("всё ок")

            // Получение пользователей из базы данных
            const users = await User.find()
            res.json(users)
            res.json("всё ок")
        }catch(e){
            console.log(e)
            res.status(400).json({message:'Угадай какая ошибка?'})            
        }
    }
}
module.exports = new authController()