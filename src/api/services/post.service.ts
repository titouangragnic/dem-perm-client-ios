import { socialApiClient } from '../client';
import { PostDto } from '@/api/dtos/post.dto';
import { PostMediaDto } from '@/api/dtos/post-media.dto';
import { UserProfileDto } from '@/api/dtos/user-profile.dto';
import { UserDto } from '@/api/dtos/user.dto';
import { ForumDto } from '@/api/dtos/forum.dto';

export interface CreatePostDto {
  title : string;
  content: string;
  subforum_id: string;
}

export interface Like {
  like_id: string;
  user_id: string;
  username: string;
  post_id: string;
  created_at: string;
}

interface PostServerDto {
    post_id: string;
    author_id: string;
    author_username: string;
    subforum_id: string;
    title: string;
    content: string;
    content_signature: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    updated_at: string;
}

function postServerDtoToPostDto(dto: PostServerDto): PostDto {
    const postDto = new PostDto();
    postDto.postId = parseInt(dto.post_id);
    postDto.content = dto.content;
    postDto.createdAt = new Date(dto.created_at);
    postDto.updatedAt = new Date(dto.updated_at);
    
    // Mapping de l'auteur
    const userDto = new UserDto();
    userDto.userId = parseInt(dto.author_id);
    userDto.username = dto.author_username;
    
    const authorDto = new UserProfileDto();
    authorDto.user = userDto;
    postDto.author = authorDto;
    
    // Mapping du forum
    const forumDto = new ForumDto();
    forumDto.forumId = parseInt(dto.subforum_id);
    postDto.forum = forumDto;
    
    // Initialisation des tableaux vides
    postDto.medias = [];
    postDto.comments = [];
    
    return postDto;
}

/**
 * Service pour interagir avec les posts de l'API Social (localhost:8000)
 */
export const postService = {
  /**
   * Crée un nouveau post
   * POST /api/v1/posts/create/
   */
  async createPost(postData: CreatePostDto): Promise<PostDto> {
    try {
      const response = await socialApiClient.post<PostServerDto>('/api/v1/posts/create/', postData);
      return postServerDtoToPostDto(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la création du post:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère les posts à découvrir
   * GET /api/v1/posts/discover/
   */
  async getDiscoverPosts(): Promise<PostDto[]> {
    try {
      const response = await socialApiClient.get<PostServerDto[]>('/api/v1/posts/discover/');
      return response.data.map(postServerDtoToPostDto);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des posts discover:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère le feed de posts de l'utilisateur connecté
   * GET /api/v1/posts/feed/
   */
  async getFeedPosts(): Promise<PostDto[]> {
    try {
      const response = await socialApiClient.get<PostServerDto[]>('/api/v1/posts/feed/');
      return response.data.map(postServerDtoToPostDto);
    } catch (error: any) {
      console.error('Erreur lors de la récupération du feed:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère un post par son ID
   * GET /api/v1/posts/{post_id}/
   */
  async getPostById(postId: string): Promise<PostDto> {
    try {
      const response = await socialApiClient.get<PostServerDto>(`/api/v1/posts/${postId}/`);
      return postServerDtoToPostDto(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la récupération du post:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Supprime un post
   * DELETE /api/v1/posts/{post_id}/delete/
   */
  async deletePost(postId: string): Promise<void> {
    try {
      await socialApiClient.delete(`/api/v1/posts/${postId}/delete/`);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du post:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Like un post
   * POST /api/v1/posts/{post_id}/like/
   */
  async likePost(postId: string): Promise<Like> {
    try {
      const response = await socialApiClient.post<Like>(`/api/v1/posts/${postId}/like/`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors du like du post:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère les likes d'un post
   * GET /api/v1/posts/{post_id}/likes/
   */
  async getPostLikes(postId: string): Promise<Like[]> {
    try {
      const response = await socialApiClient.get<Like[]>(`/api/v1/posts/${postId}/likes/`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des likes:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Unlike un post
   * DELETE /api/v1/posts/{post_id}/unlikes/
   */
  async unlikePost(postId: string): Promise<void> {
    try {
      await socialApiClient.delete(`/api/v1/posts/${postId}/unlikes/`);
    } catch (error: any) {
      console.error('Erreur lors du unlike du post:', error.response?.data || error.message);
      throw error;
    }
  },
};

