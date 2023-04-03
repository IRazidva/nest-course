import {SetMetadata} from "@nestjs/common";

export const ROLES_KEY = 'roles'; //19 создать const, по этому ключу сможем получать метаданные внутри гварда
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); // фун-декоратор. в параметры массив ролей
                                            //функцией SetMetadata() прокидываем эти роли

//19 теперь внутри roles.guard эти роли можно получить