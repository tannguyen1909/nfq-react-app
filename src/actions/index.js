import {$db} from '../services';


export const REQUEST_POSTS  = 'REQUEST_POSTS';
export const RECEIVE_POSTS  = 'RECEIVE_POSTS';
export const SELECT_POST    = 'SELECT_POST';
export const GET_POST       = 'GET_POST';

export const requestPosts = () => ({
    type: REQUEST_POSTS
});

export const receivePosts = (data) => ({
    type: RECEIVE_POSTS,
    posts: data
});

export const selectPost = (id) => ({
    type: SELECT_POST,
    currentId: id
});

export const fetchPosts = (dispatch) => {
    let data = [];
    dispatch(requestPosts());

    return $db.orderBy("dateCreated", "desc").get().then(querySnapshot => {
        querySnapshot.forEach(file => {
            data.push({...{id: file.id}, ...file.data()});
        });
        return dispatch(receivePosts(data));
    });
};