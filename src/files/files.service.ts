import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import  * as path from 'path';//23 импорт стандартного модуля nodejs для работы с путями,это без команды в консоли
import * as  fs from 'fs';  //23 импорт стандартного модуля nodejs для работы с файлами,это без команды в консоли
import * as uuid from 'uuid' //23 установить пакет uuid(командой npm i uuid), чтобы генерировать случайные названия для файла
                                //npm i uuid
@Injectable()
export class FilesService {

    async createFile(file): Promise<string>{
        try { // при записи потенциально могут возникнуть ошибки, поэтому try/catch
            const fileName = uuid.v4() + '.jpg';//23 uuid генерит и тк это изображение, то добавляем .jpg
            const filePath = path.resolve(__dirname, '..', 'static')//23 получить путь к этому файлу
                        //(__dirname - получаем текущую папку, '..' - возвращаемся на одну, тк находимся в папке files,
                        //'static' - папка статик). path.resolve весь этот путь склеит
            if(!fs.existsSync(filePath)){//23 если по этому пути ничего не существует,
                fs.mkdirSync(filePath, {recursive: true}) // 23 то создаем папку
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)//23 если папка по такому пути существует, то
                                            //записываем туда файл и с помощью path.join склеиваем путь с названием файла
                                            //II параметр file.buffer - буффер, котор достаем из файла и файл запишется
                                            // в файловую систему
            return fileName;  //23 возвратить название файла

        } catch (e){
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
