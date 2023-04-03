import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";


@Controller('roles') //13.  все по аналог с user. преффикс добавил nest cli сам
export class RolesController {

    //13. сначала создать roles.service, create-role.dto.
    constructor(private roleService: RolesService) {} //13. внедряем RolesService

    @Post()
    create(@Body() dto: CreateRoleDto){
        return this.roleService.createRole(dto);

    }

    @Get('/:value')//13. изменяющийся участок пути в который добавляем value из @Param
    getByValue(@Param('value') value: string){ //анн, в параметры value,который надо  вытащить.
        return this.roleService.getRoleByValue(value);

    }
}
