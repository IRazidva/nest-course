import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {ValidationException} from "../exception/validation.exception";

//21 нужен для валидации входных данных. implements PipeTransform<any>, реализуем transform()
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToClass(metadata.metatype, value); //21 получаем объект, который надо валидировать(это тело запроса)
                        // и преобразовываем с помощью plainToClass() значение в нужный нам класс
        const errors = await validate(obj);//21 с помощью validate() получаем ошибки, которые вернутся после валидации
                                        // полученного объекта

        if(errors.length){ // 21 если массив ошибок имеет длину(те есть ошибки), то кастомное искл с сообщением
                            //ошибки- это или неправильный email, или длина пароля массив ошибок состоит из тех элементов
                            // которые мы указывали в create-user.dto(@IsString, @Length, @IsEmail), но не понятно к
                            // каким полям относится. поэтому пишем messages
            let messages = errors.map(err => { //21 сообщение для ValidationException
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`  //21 err.property это поле
                                        // которое не прошло валидацию, err.constraints это сообщения из @IsString, @Length, @IsEmail
                                        // с помощью map проходим по этому массиву и джойним их в строку через запятую

            })

            throw new ValidationException(messages) // 21 кастомное искл.
        }

        return value;//21 это value из параметра transform()
    }

}
//21 ValidationPipe указать глобально в main.ts