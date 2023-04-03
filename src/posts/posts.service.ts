import { Injectable } from '@nestjs/common';
import {CreatePostDto} from "./create-post.dto";
import {Post} from "./posts.model";
import {InjectModel} from "@nestjs/sequelize";
import {FilesService} from "../files/files.service";

@Injectable()
export class PostsService {

    constructor(@InjectModel(Post) private postRepo: typeof Post,//22 заинжектить Post (чтобы сохранять посты в бд)
                                                //не забыть указать атрибуты для создания поста PostCreationAttrs в Post
                private fileService: FilesService) { //23 инжектировать FilesService можно после того как добавили в
                                                    // PostsModule  в imports: [FilesModule]
    }
    async  create(dto: CreatePostDto, image: any) {
        const fileName = await this.fileService.createFile(image)//23 createFile() вернет стр - название файла(fileName)
        const post = await this.postRepo.create({...dto, image: fileName}) //22 сохранить пост в бд. поле image
                                            // будем перезаписывать, тк в image находится само изображение (сам файл),
                                            //а нам нужно его название.
        return post;
    }
}
