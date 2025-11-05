import { UserDto } from './user.dto';

export class UserProfileDto {
    profileId!: number;
    user!: UserDto;
    displayName!: string;
    profilePictureUrl!: string;
    bio!: string;
    location!: string;
    createdAt!: Date;
    updatedAt!: Date;
}
