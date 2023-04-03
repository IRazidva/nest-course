import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) { //19. заинжектить еще и Reflector чтобы обращаться к  его метода
    }

    //19. по аналогии с auth.guard(+ Reflector, чтобы вызвать reflector.getAllAndOverride )
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass()
            ]) // 19. в параметры декоратор, который сделали и массив из элементов контекста(что бы этот рефлектор
                // понимал, какие данные ему необходимы)
            if (!requiredRoles) { //19 если этих ролей нет(те вернулся null) эта фун-я будет доступна всем пользователям
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token);
            req.user = user;
            return  user.roles.some(role => requiredRoles.includes(role.value));//19 после декодир jwt токена с помощью
            // some() проверяем есть ли у пользователя  роль, необходимая для этого эндпоинта. Теперь в user.controller
            //можно добавить @Roles(наш декоратор) и @UseGuards
        } catch (e){
            console.log(e)
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
        }
    }

}