import { Question } from '../types/types';

export type OrderType =
  | 'score-user'
  | 'score-group'
  | 'date-user'
  | 'date-group';

export interface FeedState {
  posts: Question[];
  hasMore: boolean;
  order: OrderType;
}

export type FeedAction =
  | { type: 'SET_POSTS'; payload: Question[] }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_ORDER'; payload: OrderType }
  | { type: 'RESET_POSTS' };

export const initialState: FeedState = {
  posts: [],
  hasMore: true,
  order: 'score-user',
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
            (post) => !action.payload.some((newPost) => newPost.id === post.id),
          ),
          ...action.payload,
        ],
      };
    case 'SET_HAS_MORE':
      return {
        ...state,
        hasMore: action.payload,
      };
    case 'SET_ORDER':
      return {
        ...state,
        order: action.payload,
      };
    case 'RESET_POSTS':
      return {
        ...state,
        posts: [],
        hasMore: true,
      };
    default:
      return state;
  }
};
