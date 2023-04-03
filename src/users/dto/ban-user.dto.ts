export class BanUserDto{
    readonly userId: number;
    readonly banReason: string;
}
//20 дто для возможности забанить. использовать в users.service