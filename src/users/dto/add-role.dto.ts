import {IsNumber, IsString} from "class-validator";

//20 дто для добавления ролей. использовать в users.service
export class AddRoleDto{
    @IsString({message: 'Роль должна быть строкой'}) // 21 после того, как реализовали pipe можно и сюда
                                                            // добавить валидаторы и будет понятно к какому полю какое сообщение
    readonly value: string;

    @IsNumber({}, {message: 'Id должен быть числом'})
    readonly userId: number;
}