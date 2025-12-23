import { socialApiClient } from '../client';

export interface CreateUserDto {
  username: string;
  biography?: string;
  location?: string;
  isPrivate: boolean;
}

export interface UpdateUserDto {
  username?: string;
  display_name?: string;
  profile_picture_url?: string;
  bio?: string;
  location?: string;
  privacy?: 'public' | 'private';
}

export interface UserProfile {
  id: string;
  firebaseUid: string;
  username: string;
  biography?: string;
  location?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  // Ajoutez d'autres champs selon votre backend
}

/**
 * Service pour interagir avec l'API Social (localhost:8000)
 */
export const userService = {
  /**
   * Crée un nouvel utilisateur sur le backend social
   * POST /api/v1/users/
   */
  async createUser(userData: CreateUserDto): Promise<UserProfile> {
    try {
      const response = await socialApiClient.post<UserProfile>('/api/v1/users/', userData);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère les informations de l'utilisateur connecté
   * GET /api/v1/users/me
   */
  async getMe(): Promise<UserProfile | null> {
    try {
      const response = await socialApiClient.get('/api/v1/users/me/');
      const res = response.data;
      return res === "" ? null : res;
    } catch (error: any) {
      console.error('Erreur lors de la récupération du profil:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère les informations d'un utilisateur par son ID
   * GET /api/v1/users/{id}
   */
  async getUserById(userId: string): Promise<UserProfile> {
    try {
      const response = await socialApiClient.get<UserProfile>(`/api/v1/users/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Met à jour les informations de l'utilisateur connecté
   * PATCH /api/v1/users/me/update/
   */
  async updateMe(userData: UpdateUserDto): Promise<UserProfile> {
    try {
      const response = await socialApiClient.patch<UserProfile>(
        '/api/v1/users/me/update/',
        { data: userData },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error.response?.data || error.message);
      throw error;
    }
  },
};
