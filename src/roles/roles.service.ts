import { Injectable } from '@nestjs/common';
import {CreateRoleDto} from "./dto/create-role.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "./roles.model";


//13. для операций с ролями. по анологии с user.service (создать create-role.dto, roles.controller)
//когда создадим не забыть заинжектить в users.service
@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepo: typeof Role) {
    }

    async createRole(dto: CreateRoleDto){ //13.создать create-role.dto
        const role = await this.roleRepo.create(dto);
        return role;
    }


    async getRoleByValue(value: string){
        const role = await this.roleRepo.findOne({where: {value}});
        return role;
    }
}
