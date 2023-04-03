import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {Post} from "../posts/posts.model";


interface UserCreationAttrs{ // описываем поля которые нужны именно для СОЗДАНИЯ объекта.
    email: string;
    password: string;
}

// 8. класс-схема для бд, для этого extends Model<User, UserCreationAttrs>
// эту модель добавить в SequelizeModule.forRoot(module:[User] в app.module
// и в @Module({ imports: [SequelizeModule.forFeature([User]) ] } ) в users.module
// после запуска таблица сама в базе сгенерится. там будут еще два столбца. дата созд и дата обновл
@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs >{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})//11. анн, что бы в сваггере возвращались
                        // данные. перед этим в main.ts заводим SwaggerModule.setup()
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Razumova@gmail.com', description: 'Адрес электронной почты'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;


    @ApiProperty({example: '12345', description: 'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'true', description: 'Забанен пользователь или нет'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'За хулиганство', description: 'Причина блокировки'})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @BelongsToMany(() => Role, () => UserRoles)//12. тк many to many надо указать с какой
        // сущностью связать (Role) и связующую табл(UserRoles) ,надо сделать UserRoles
    roles: Role[];

    @HasMany(() => Post) // 22 для связи с Posts (много постов у одного юзера), а в posts.model @BelongsTo(() => User)
                                         // не перепутать с Post из  "@nestjs/common при импорте в этом классе User
                                        // добавить в app.module в imports:[Post]
    post: Post[];
}