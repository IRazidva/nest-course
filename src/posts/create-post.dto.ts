
// dto для PostModel
export class CreatePostDto{
    readonly title: string;
    readonly content: string;
    readonly userId: number; // 22 лучше id доставать из токена, здесь упрощенный вариант, прямо из дто достаем

}