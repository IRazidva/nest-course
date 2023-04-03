import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";

//требуется установить модуль для работы с JWT токеном и модуль для шифрования паролей командой npm i @nestjs/jwt bcryptjs
//
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef(() => UsersModule),//15.здесь в auth.module регистрируем imports: [UsersModule] , так же надо
      //зарегимтрировать в UsersModule в exports:[UsersService],  18.forwardRef() нужен, что бы избежать кольцевую
      // зависимость между AuthModule и UserModule. добавить forwardRef() и в UserModule
      JwtModule.register({ // 16. авторизация через jwt, поэтому регаем здесь модуль, который установили (npm i @nestjs/jwt)
        secret: process.env.PRIVATE_KEY || 'SECRET',//16.добавить PRIVATE_KEY в development.env
        signOptions: {
          expiresIn: '24h' // токен живет 24 ч
        }
      })
  ],
  exports: [
    AuthService,//15
    JwtModule // 16 здесь добавляем, а в AuthService инжектим в конструкторе JwtService
  ]
})
export class AuthModule {}
