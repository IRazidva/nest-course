import { Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";
import {Role} from "./roles.model";


//12. связующая табл добавить ее в импорты в RolesModule, в UsersModule и в AppModule
@Table({tableName: 'user_roles', createdAt: false, updatedAt: false})//12. столбцы дат coзд и обнов не нужны, что бы не перегружать табл
export class UserRoles extends Model<UserRoles>{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Role)// анн, что бы Sequelize понимал от чего ForeignKey
    @Column({type: DataType.INTEGER})
    roleId: number;


    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

}