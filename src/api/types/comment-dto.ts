import {UserDto} from "@/api/types/user.dto";

export class CommentDto {
    commentId!: number;
    author!: UserDto;
    comments!: CommentDto;
    content!: string;
    createdAt!: Date;
    updatedAt!: Date;
}