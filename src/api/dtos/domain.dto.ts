import {ForumDto} from "@/api/types/forum.dto";

export class DomainDto {
    domainId!: number;
    domainName!: string;
    forums!: ForumDto[];
}