import {Body, Controller, Get, Post, UseGuards, UsePipes} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {JwtAuthGuard} from "../auth/jwt-auth-guard";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {ValidationPipe} from "../pipes/validation.pipe";

@ApiTags('Пользователи')//11. описание группы контроллеров(это для сваггера)
@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}//10. заинжектить сервис из которого берем методы

    @ApiOperation({summary: 'Создание пользователя'})//11. описание (отображается в сваггере)
    @ApiResponse({status: 200, type: User}) // 11. что вернет (отображается в сваггере)
    //@UsePipes(ValidationPipe) // здесь можно удалить, в main добавить много пайпов
    @Post()
    create(@Body() userDto: CreateUserDto){ //тело запроса. в параметры дто
        return this.userService.createUser(userDto);
    }

    @ApiOperation({summary: 'Получить всех пользователей'})
    @ApiResponse({status: 200, type: [User]})//11. здесь возвращает [User]
    @Roles('ADMIN')     //19 самодельный декоратор. через запятую можно указать каким ролям доступен этот эндпоинт
    @UseGuards(RolesGuard)    //19 чтобы сработали ограничения
    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

    @ApiOperation({summary: 'Выдать роль'})//20 надо создать AddRoleDto в users.dto, и метод в user.service addRole(dto)
    @ApiResponse({status: 200})
    @Roles('ADMIN')//19 самодельный декоратор. через запятую можно указать каким ролям доступен этот эндпоинт
    @UseGuards(RolesGuard)//19 чтобы сработали ограничения
    @Post('/role')
    addRole(@Body() dto: AddRoleDto){//20  надо создать AddRoleDto, чтобы получать дто в теле, и метод в user.service addRole(dto)
        return this.userService.addRole(dto);
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    @ApiResponse({status: 200})
    @Roles('ADMIN')    //19 самодельный декоратор. через запятую можно указать каким ролям доступен этот эндпоинт
    @UseGuards(RolesGuard)   //19 чтобы сработали ограничения
    @Post('/ban')
    ban(@Body() dto: BanUserDto){ //20  надо создать BanUserDto, чтобы получать дто в теле, и метод в user.service ban(dto)
        return this.userService.ban(dto);
    }

}
