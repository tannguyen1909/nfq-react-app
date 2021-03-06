import {REQUEST_POSTS, RECEIVE_POSTS, REQUEST_FINISH, SELECT_POST, UPDATE_STATE, RESET_DETAIL} from '../actions'


const posts = (state = {
    isFetching: false,
    data: [],
    currentId: null,
    activePage: 1,
    currentPost: {},
    mode: 'view',
    opening: false,
    isSearching: false
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
                isSearching: action.isSearching,
                data: action.data || [],
                activePage: 1
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