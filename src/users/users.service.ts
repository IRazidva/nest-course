import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";

@Injectable() // @нн для того, что бы инжектировать, куда-нить
export class UsersService {

    constructor(@InjectModel(User) private userRepo: typeof User, //9.внедрение модели типа User называем объект userRepo
                private roleService: RolesService) {}//13. не забыть заинжектить, когда создадим роль. и добавить в экспорты
                                                     //в roles.module

    async createUser(dto: CreateUserDto){ //9. создать дто - простой объект для создания юзера
        const user = await this.userRepo.create(dto); //9.тк userRepo типа User, а User extends Model<> из sequelize-typescript
                                // у userRepo есть функция create() и другие(как в SpringData, методы уже встроены в репо)
        const role = await this.roleService.getRoleByValue("ADMIN") //14. после создания ролей только можно
        // получить ее из бд (getRoleByValue("ADMIN") что в параметре, такая и создастся) и присвоить роль пользователю
        await user.$set('roles', [role.id])//14. $set позволяет перезаписать поле и сразу обновить его
                                                        // только внутри бд
        user.roles = [role]      //14. добавление к самому пользователю роли(не только в бд что бы было, как делает .$set выше)
        return user;
    }

    async getAllUsers(){
        const users = await this.userRepo.findAll({include: {all: true}}); //14.{include: {all: true}} в findAll()
                        // нужно для того, что бы все поля которые связаны с юзером будут подтягиваться. можно выборочно
        return users;
    }

    async getUserByEmail(email: string){
        const user = await this.userRepo.findOne({where:{email}, include: {all: true}})
        return user;
    }

    async addRole(dto: AddRoleDto){ //20. сделать AddRoleDto в users.dto
        const user = await this.userRepo.findByPk(dto.userId); //20 получить пользователя из дто по id пользователя
        const role = await this.roleService.getRoleByValue(dto.value);// 20. получить роль из бд
        if(role && user){ //20 если и роль и пользователь есть в бд,
            await user.$add('role', role.id); //20 то добавляем эту роль этому пользователю.
            // $add(поле в которое добавить, значение). в отличие от $set(тут изначально эти роли инициализировали), а в
            // $add(уже к проинициализированной роли, добавляем еще значение в массив)
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async ban(dto: BanUserDto) { //20. сделать BanUserDto
        const user = await this.userRepo.findByPk(dto.userId);//20 получить пользователя по id
        if (!user){
            throw new HttpException('Пользователь не найдены', HttpStatus.NOT_FOUND);

        }
        user.banned = true; //20 меняем на true(по умолчанию false)
        user.banReason = dto.banReason; //20 причину блокировки получаем из дто BanUserDto
        await user.save(); //20 обновляем значение в бд
        return user;
    }
}
