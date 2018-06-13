import {REQUEST_POSTS, RECEIVE_POSTS, REQUEST_FINISH, SELECT_POST, UPDATE_STATE, RESET_DETAIL} from '../actions'


const posts = (state = {
    isFetching: false,
    data: [],
    currentId: null,
    currentPage: 1,
    currentPost: {},
    mode: 'view',
    opening: false
}, action) => {
    switch (action.type) {
        case REQUEST_POSTS:
            return {
                ...state,
                isFetching: true
            };
        case REQUEST_FINISH:
            return {
                ...state,
                isFetching: false
            };
        case RECEIVE_POSTS:
            return {
                ...state,
                isFetching: false,
                data: action.data || []
            };
        case SELECT_POST:
            return {
                ...state,
                currentId: action.currentPost.id,
                currentPost: action.currentPost,
                mode: 'view',
                opening: true
            };
        case UPDATE_STATE:
            return {
                ...state,
                ...action.state
            };
        case RESET_DETAIL:
            return {
                ...state,
                ...{
                    opening: false,
                    currentId: null,
                    currentPost: {},
                    mode: 'view'
                }
            };
        default:
            return state
    }
};

export default posts;