import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import {User} from "../users/users.model";

@Injectable() // @нн для того, что бы инжектировать, куда-нить (в нашем случае @Module(providers:) в app.module
export class AuthService {

    constructor(private userService: UsersService,  // 15.заинжектить UsersService здесь. Далее зарегистрировать  в
                                    // imports: [UsersModule] в auth.module, и сам сервис в exports:[UsersService] в
                                    // UsersModule
                private jwtService: JwtService) { //16. здесь инжектим JwtService(он идет с JwtModule),
                                                    // так же  в AuthModule в exports: [JwtModule]
    }

    async  login(userDto: CreateUserDto){//17. авторизация.  validateUser() сделан ниже
        const  user = await  this.validateUser(userDto)
        return this.generateToken(user) //17. возвращаем то, что вернет generateToken(user)(сделанный ниже)
    }

    async  registration( userDto: CreateUserDto){
        const candidate = await this.userService.getUserByEmail(userDto.email); //16 завести getUserByEmail() в UserService
        if (candidate) {
            throw new HttpException("Пользователь с таким email уже сущкствует", HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5) //16 хешируем пароль. для этого import * as bcrypt from 'bcryptjs'
                                                                // и теперь в  bcrypt.hash(пароль достаем из дто, соль)
        const user = await this.userService.createUser({...userDto, password: hashPassword})//16 в .createUser в параметры
                                                    //дто и перезаписанный, захешированный пароль
        return this.generateToken(user) // 16. возвращаем токен. generateToken() создаем ниже
    }

    private async generateToken(user: User){ //16. на основе даных юзера генерирует jwt токен
        const payLoad = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payLoad)
        }
    }      //декодировать токены можно на сайте jwt.io

    private async validateUser(userDto: CreateUserDto) {
        const  user = await this.userService.getUserByEmail(userDto.email)
        const passwordEquals = await bcrypt.compare(userDto.password, user.password)//17. проверка совпадают ли пароль
                                                                                    // который пришел с паролем в бд
        if(user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }
}
