import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto{// 9. дто- простой объект для создания юзера. только 2поля(как oписывали в ин-се UserCreationAttrs в users.model)

    @ApiProperty({example: 'Razumova@gmail.com', description: 'Адрес электронной почты'})//11. смотреть в сваггере,
                        // что ожидаем на входе. Перед этим настроить сваггер в main.ts, в user.controller и в users.model
    @IsString({message: 'email должен быть строкой'})//21 валидация @IsString значит, что поле должно быть стр
    @IsEmail({}, {message: 'Некорректный email'})//21 по регулярке проверяется корректность адреса
    readonly email: string;

    @ApiProperty({example: '12345', description: 'Пароль пользователя'})
    @IsString({message: 'Пароль должен быть строкой'})//21 валидация @IsString значит, что поле должно быть стр
    @Length(4, 16, {message:'Не меньше 4 и не больше 16 символов'})//21 валидация в параметрах @Length (max и  min ) все понятно
    readonly password: string;
}

//21 @IsString, @IsEmail, @Length работают , но с помощью ValidationPipe  добавим преобразования