import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Post} from "../posts/posts.model";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, Post]),//8.12.здесь регистрируем модели (еще рег-ем в
                                                        // SequelizeModule.forRoot({models: [User]}) в app.module)

        RolesModule,
        forwardRef(() => AuthModule) //18. forwardRef() нужен, что бы избежать кольцевую зависимость
                                        //между AuthModule и UserModule. добавить forwardRef() и в AuthModule
    ],

    exports: [UsersService]//15. что бы AuthModule работал. так же надо заинжектить UsersService в AuthService.
    // Далее зарегистрировать  в здесь в exports:[UsersService] в UsersModule, и в imports: [UsersModule] в auth.module
})
export class UsersModule {
}
