import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {UserRoles} from "./user-roles.model";


interface RoleCreationAttrs{
    value: string;
    description: string;
}

// 12.алгоритм создания класса, полей  как User в users.model. не забыть добавить  role.module
// imports:[SequelizeModule.forFeature([Role])] и в app.module models:[]
@Table({tableName: 'roles'})
export class Role extends Model<Role, RoleCreationAttrs >{

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'ADMIN', description: 'Уникальное значение роли пользователя'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    value: string;


    @ApiProperty({example: 'Администратор', description: 'Описание роли  пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @BelongsToMany(() => User, () => UserRoles) //12. тк many to many надо указать с какой
        // сущностью связать (User) и связующую табл(UserRoles) ,надо сделать UserRoles
    users: User[];



}