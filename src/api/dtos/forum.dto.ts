import {UserDto} from "@/api/types/user.dto";
import {PostDto} from "@/api/types/post.dto";
import {DomainDto} from "@/api/types/domain.dto";

export class ForumDto {
    forumId!: number;
    creator!: UserDto;
    forumName!: string;
    description!: string;
    forumImageUrl!: string;
    domains!: DomainDto[];
    posts!: PostDto[];
    memberCount!: number;
    postCount!: number;
    createdAt!: Date;
    updatedAt!: Date;
}