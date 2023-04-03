import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreatePostDto} from "./create-post.dto";
import {PostsService} from "./posts.service";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('posts')
export class PostsController {

    constructor(private postService: PostsService) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('image')) //23 декоратор для работы с файлами
    createPost(@Body() dto: CreatePostDto, //22 создать CreatePostDto, это будет тело запроса
               @UploadedFile() image){  //22 @UploadedFile - декоратор, что бы получить файл в эндпоинте
                                        //(в @nestjs уже встроен пакет для работы с файлами, поэтому получить файл можно)
        return this.postService.create(dto, image) // II параметр - само изображение.(создать create в posts.service)

    }
}
