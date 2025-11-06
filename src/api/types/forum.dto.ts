import {UserDto} from "@/api/types/user.dto";
import {PostMediaDto} from "@/api/types/post-media.dto";

export class ForumDto {
    forumId!: number;
    creator!: UserDto;
    forumName!: string;
    description!: string;
    forumImageUrl!: string;
    posts!: PostMediaDto[];
    memberCount!: number;
    postCount!: number;
    createdAt!: Date;
    updatedAt!: Date;
}