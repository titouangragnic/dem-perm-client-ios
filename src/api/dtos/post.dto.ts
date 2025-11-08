import {UserProfileDto} from "@/api/types/user-profile.dto";
import {ForumDto} from "@/api/types/forum.dto";
import {PostMediaDto} from "@/api/types/post-media.dto";
import {CommentDto} from "@/api/types/comment-dto";

export class PostDto {
    postId!: number;
    author!: UserProfileDto;
    forum!: ForumDto;
    content!: string;
    medias!: PostMediaDto[];
    comments!: CommentDto[];
    createdAt!: Date;
    updatedAt!: Date;
}