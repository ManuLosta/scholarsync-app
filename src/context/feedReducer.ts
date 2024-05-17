import { Question } from '../types/types';

export interface Post {
  question: Question;
  score: number;
}

export interface FeedState {
  posts: Post[];
  page: number;
  hasMore: boolean;
  scrollPosition: number;
}

export type FeedAction =
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_SCROLL_POSITION'; payload: number }
  | { type: 'RESET_POSTS' };

export const initialState: FeedState = {
  posts: [],
  page: 0,
  hasMore: true,
  scrollPosition: 0,
};

export const feedReducer = (
  state: FeedState,
  action: FeedAction,
): FeedState => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        ...state,
        posts: [
          ...state.posts.filter(
            (post) =>
              !action.payload.some(
                (newPost) => newPost.question.id === post.question.id,
              ),
          ),
          ...action.payload,
        ],
      };
    case 'SET_PAGE':
      return {
        ...state,
        page: action.payload,
      };
    case 'SET_HAS_MORE':
      return {
        ...state,
        hasMore: action.payload,
      };
    case 'SET_SCROLL_POSITION':
      return {
        ...state,
        scrollPosition: action.payload,
      };
    case 'RESET_POSTS':
      return {
        ...state,
        posts: [],
        page: 1,
        hasMore: true,
      };
    default:
      return state;
  }
};
