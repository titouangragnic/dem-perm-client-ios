import {SimplePost} from "@/api/types/common/simple-post";

export class FullPost {
    post!: SimplePost;
    comments!: Comment[];
}