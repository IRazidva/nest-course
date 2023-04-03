import { Module } from '@nestjs/common';
import { FilesService } from './files.service';

@Module({
  providers: [FilesService],
  exports: [FilesService] //23. добавить в PostModule в imports: [FilesModule] и FilesService будет автоматически
                          //импортироваться вместе с FilesModule
})
export class FilesModule {}
