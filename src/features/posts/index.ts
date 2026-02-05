/**
 * Post Feature Exports
 * 
 * Centralized exports for post-related functionality.
 */

// Domain Model
export { Post, PostType } from '@/entities/post/model';

// Repository
export { PostRepository, postRepository } from './repositories/postRepository';

// Service
export { PostService, postService } from './services/postService';
