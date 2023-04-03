// точка входа в прил-е

import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {JwtAuthGuard} from "./auth/jwt-auth-guard";
import {ValidationPipe} from "./pipes/validation.pipe";

async function start(){
    const PORT = process.env.PORT || 5000;

    //создаем экз-р пр-я, с помощью NestFactory(который импортируем из @nestjs/core) и в create() помещаем модуль AppModule, который завели в app.module
    const app = await NestFactory.create(AppModule)

    //11.настройка swagger сначала установить пакеты npm i @nestjs/swagger и npm i @nestjs/swagger-ui-express
    const congig = new DocumentBuilder() //11.DocumentBuilder(описано в документации nestjs) -для опис-я документа
        .setTitle('Урок по продвинутому BackEnd')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .addTag('Razumova nestjs/swagger')
        .build()

    const document = SwaggerModule.createDocument(app, congig); //11.SwaggerModule(описано в документации nestjs)
                                                                // создание объекта документации
    SwaggerModule.setup('/api/docs', app, document)  // 11./api/docs - преффикс по которому можно открыть док-ю в браузере
                                                          //что будет отображаться описываем в users.controller
                                                          //и чтобы возвращались сами данные в users.model добавляем @ApiProperty
                                                          //что ожидаем на входе опис-м в create-user-dto в@ApiProperty

    app.useGlobalPipes(new ValidationPipe())//21 указываем глобально все Pipe через запятую. они будут отрабатывать для каждого эндпоинта

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start()
