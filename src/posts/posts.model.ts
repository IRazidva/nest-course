import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import {User} from "../users/users.model";


interface PostCreationAttrs{//22.описываем поля которые нужны именно для СОЗДАНИЯ объекта.
    title: string;
    content: string;
    userId: number;
    image: string;
}


@Table({tableName: 'posts'})
export class Post extends Model<Post, PostCreationAttrs >{

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    title: string;


    @Column({type: DataType.STRING, allowNull: false})
    content: string;

    @Column({type: DataType.STRING}) //22 это поле хранит название изображения
    image: string;

    @ForeignKey(() => User)//22 указываем, что это внешний ключ и на такую табл ссылается
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User)//22 связь oneToMany поэтому здесь @BelongsTo, а в users.model дописать @HasMany(() => Post)
                                            //добавить в app.module в imports:[Post]
    author: User

}