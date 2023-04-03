import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

//18.Guard накладывает ограничения. в нашем случае запрещает неавторизованным пользователям обращаться к эндпоинтам
@Injectable()
export class JwtAuthGuard implements CanActivate { //18.надо реализовать метод этого интерфейса canActivate()

    constructor(private jwtService: JwtService) {
    }
    //18. суть canActivate(): return  true - доступ разрешен, return  false - доступ запрещен
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest() //18.получить объект req из контекста. внутри req можно получать headers
        try {
            const authHeader = req.headers.authorization;//18 вытаскиваем хедер authorization, он состоит из 2 частей
            const bearer = authHeader.split(' ')[0] //18 тип токена (1 часть)
            const token = authHeader.split(' ')[1]  //18  сам токен (2 часть)

            if(bearer !== 'Bearer' || !token){ //18. если с клиента пришел пустой headers.authorization
                                                // (в нем нет тоекна или/ и не указан его тип )
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token);//18 если if не сработал, то  надо токен раскодировать
            req.user = user;//18 помещаем раскодированного юзера в req
            return  true;
        } catch (e){
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }

}