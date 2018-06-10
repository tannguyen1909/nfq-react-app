import {REQUEST_POSTS, RECEIVE_POSTS, SELECT_POST} from '../actions'


const posts = (state = {}, action) => {
    switch (action.type) {
        case REQUEST_POSTS:
            return {
                ...state,
                isFetching: true
            };
        case RECEIVE_POSTS:
            return {
                ...state,
                isFetching: false,
                posts: action.posts || []
            };
        case SELECT_POST:
            return {
                ...state,
                currentId: action.currentId
            };
        default:
            return state
    }
};

export default posts;