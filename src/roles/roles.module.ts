import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import {RolesController} from './roles.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "./roles.model";
import {User} from "../users/users.model";
import {UserRoles} from "./user-roles.model";

@Module({
    providers: [RolesService],
    controllers: [RolesController],
    imports: [
        SequelizeModule.forFeature([Role, User, UserRoles]) //12.здесь регистрируем модели (еще рег-ем в
        // SequelizeModule.forRoot({models: [User, ...]}) в app.module)
    ],
    exports: [
        RolesService //13. когда создадим roles.service, roles.controller, dto. Теперь этот RolesService, вместе со всем
        // модулем RolesModule внутрь UserService(в конструкторе roleService: RolesService)
    ]
})
export class RolesModule {
}
