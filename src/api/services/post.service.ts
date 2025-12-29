import { socialApiClient } from '../client';
import { PostMediaDto } from '@/api/dtos/post-media.dto';
import { UserProfileDto } from '@/api/dtos/user-profile.dto';
import { UserDto } from '@/api/dtos/user.dto';
import { ForumDto } from '@/api/dtos/forum.dto';
import {FullPost} from "@/api/types/post/full-post";
import {SimpleUser} from "@/api/types/common/simple-user";
import {SimpleForum} from "@/api/types/forum/simple-forum";
import {SimplePost} from "@/api/types/common/simple-post";

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

function postServerDtoToFullPost(dto: PostServerDto): FullPost {
    const post = new FullPost();
    post.post = new SimplePost();
    post.post.id = dto.post_id;
    post.post.content = dto.content;
    post.post.createdAt = new Date(dto.created_at);
    post.post.updatedAt = new Date(dto.updated_at);
    
    // Mapping de l'auteur
    const author = new SimpleUser()
    author.id = parseInt(dto.author_id);
    author.profilePictureUrl = "https://picsum.photos/200"; //FIXME
    author.displayName = dto.author_username;

    post.post.author = author;
    
    // Mapping du forum
    const forum = new SimpleForum();
    forum.id = dto.subforum_id;
    post.post.forum = forum;
    
    // Initialisation des tableaux vides
    post.post.medias = [];
    post.comments = [];
    
    return post;
}

function postServerDtoToSimplePost(dto: PostServerDto): SimplePost {
  const post = new SimplePost();
  post.id = dto.post_id;
  post.content = dto.content;
  post.createdAt = new Date(dto.created_at);
  post.updatedAt = new Date(dto.updated_at);

  // Mapping de l'auteur
  const author = new SimpleUser()
  author.id = parseInt(dto.author_id);
  author.profilePictureUrl = "https://picsum.photos/200"; //FIXME
  author.displayName = dto.author_username;

  post.author = author;

  return post;
}

/**
 * Service pour interagir avec les posts de l'API Social (localhost:8000)
 */
export const postService = {
  /**
   * Crée un nouveau post
   * POST /api/v1/posts/create/
   */
  async createPost(postData: CreatePostDto): Promise<FullPost> {
    try {
      const response = await socialApiClient.post<PostServerDto>('/api/v1/posts/create/', postData);
      return postServerDtoToFullPost(response.data);
    } catch (error: any) {
      console.error('Erreur lors de la création du post:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère les posts à découvrir
   * GET /api/v1/posts/discover/
   */
  async getDiscoverPosts(): Promise<SimplePost[]> {
    try {
      const response = await socialApiClient.get<PostServerDto[]>('/api/v1/posts/discover/');
      return response.data.map(postServerDtoToSimplePost);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des posts discover:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère le feed de posts de l'utilisateur connecté
   * GET /api/v1/posts/feed/
   */
  async getFeedPosts(): Promise<SimplePost[]> {
    try {
      const response = await socialApiClient.get<PostServerDto[]>('/api/v1/posts/feed/');
      return response.data.map(postServerDtoToSimplePost);
    } catch (error: any) {
      console.error('Erreur lors de la récupération du feed:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Récupère un post par son ID
   * GET /api/v1/posts/{post_id}/
   */
  async getPostById(postId: string): Promise<FullPost> {
    try {
      const response = await socialApiClient.get<PostServerDto>(`/api/v1/posts/${postId}/`);
      return postServerDtoToFullPost(response.data);
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
  async likePost(postId: number): Promise<Like> {
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
  async getPostLikes(postId: number): Promise<number> {
    try {
      const response = await socialApiClient.get<Like[]>(`/api/v1/posts/${postId}/likes/`);
      return response.data.length;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des likes:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Unlike un post
   * DELETE /api/v1/posts/{post_id}/unlikes/
   */
  async unlikePost(postId: number): Promise<void> {
    try {
      await socialApiClient.delete(`/api/v1/posts/${postId}/unlikes/`);
    } catch (error: any) {
      console.error('Erreur lors du unlike du post:', error.response?.data || error.message);
      throw error;
    }
  },
};

