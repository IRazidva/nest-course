import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {UserRoles} from "./roles/user-roles.model";
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import {Post} from "./posts/posts.model";
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';


//экспортируем класс AppModule и оборачиваем в декоратор @Module из "@nestjs/common"
@Module(
    {
        controllers: [AuthController], // в параметры массив контроллеров
        providers: [AuthService], // в параметры то, что содержит логику(в нашем случае service)
        imports: [       // все что надо импортировать
            ConfigModule.forRoot({  //7. создать файл окружения (npm i @nestjs/config)
                envFilePath: `.${process.env.NODE_ENV}.env` //путь до конфигурации с системными переменными
                // {process.env.NODE_ENV} - переменная, сработает при запуске тот конфиг, с которым запустим. либо для
                //dev, либо для prod. что бы была возможность запускать по разному подключить пакет (npm i cross-env)
                //и создать соответсвующие конфиги development.env, production.env и дописать в package.json
                //cross-env NODE_ENV=development и cross-env NODE_ENV=production

            }),
            ServeStaticModule.forRoot({
                rootPath: path.resolve(__dirname, 'static'),
            }),
            SequelizeModule.forRoot({  //5. конфигурация для бд(что бы прил запустилось, создать бд в pg)
                dialect: 'postgres',
                host: process.env.POSTGRES_HOST,  // 7.значения для ключей лежат в корне в .env для prod или dev
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                models: [User, Role, UserRoles, Post],//8.12. 22.регистриуем модели здесь, так же их регистрируем в
                // @Module({imports: SequelizeModule.forFeature([User])
                //в UsersModule, в RoleModule, в PostsModule,
                autoLoadModels: true // чтобы Sequelize создавал таблицы в бд на основе моих моделей
            }),
            UsersModule, //модули сами добавляются в импорты, когда генерируем их командой nest generate module users
            RolesModule,
            AuthModule,
            PostsModule,
            FilesModule,
        ]
    })
export class AppModule {
}
