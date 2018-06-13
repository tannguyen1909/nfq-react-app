import {$db, $storage} from '../services';


export const REQUEST_POSTS      = 'REQUEST_POSTS';
export const RECEIVE_POSTS      = 'RECEIVE_POSTS';
export const SELECT_POST        = 'SELECT_POST';
export const REQUEST_FINISH     = 'REQUEST_FINISH';
export const UPDATE_STATE       = 'UPDATE_STATE';
export const RESET_DETAIL       = 'RESET_DETAIL';

export const requestPosts = () => ({
    type: REQUEST_POSTS
});

export const receivePosts = (posts, isNasa) => ({
    type: RECEIVE_POSTS,
    data: posts,
    isSearching: !!isNasa
});

export const selectPost = (post) => ({
    type: SELECT_POST,
    currentPost: post
});

export const requestFinished = () => ({
    type: REQUEST_FINISH
});

export const updateState = (state) => ({
    type: UPDATE_STATE,
    state: state
});

export const resetDetail = () => ({
    type: RESET_DETAIL
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

export const searchPostsFromNasa = (text) => (dispatch) => {
    let data = [], promises = [];
    dispatch(updateState({
        isSearching: true,
        isFetching: true
    }));

    return fetch(`https://images-api.nasa.gov/search?q=${text}`)
        .then(response => response.json())
        .then(({collection: {items}}) => {
            if (items) {
                let mediaUrl = '';

                items.forEach(({data: [post], href, links}, index) => {
                    mediaUrl = links && links[0] ? links[0].href : '';

                    data.push({
                        id: post.nasa_id,
                        title: post.title,
                        description: post.description,
                        mediaType: post.media_type,
                        link: mediaUrl,
                        dateCreated: new Date(post.date_created).getTime()
                    });

                    !mediaUrl && promises.push(
                        fetch(href).then(res => res.json())
                            .then(links => data[index].link = links[0])
                    );
                });
            }

            return Promise.all(promises)
                .then(() => dispatch(receivePosts(data, true)))
                .catch(() => dispatch(receivePosts(data, true)));
        });
};

const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const date = Date.now();

        if (file.name) {
            $storage.ref(`${date}-${file.name}`).put(file)
                .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                        .then(url => {
                            resolve({
                                link: url,
                                mediaType: file.type,
                                dateCreated: Date.now(),
                                fileName: snapshot.ref.name
                            });
                        })
                })
                .catch(reject)
        } else {
            reject();
        }
    });
};

export const createPost = (data, file) => (dispatch) => {
    dispatch(requestPosts());

    const add = (post) => {
        return $db.add(post).then(docRef => {
            docRef && dispatch(updateState({
                mode: 'view',
                currentId: docRef.id,
                currentPost: {
                    ...post,
                    ...{id: docRef.id},
                }
            }));
            dispatch(fetchPosts);
        });
    };

    if (file) {
        return uploadFile(file)
            .then((media) => {
                return add({...data, ...media});
            })
            .catch(() => {
                alert("Can not create this item. Please try again!");
                return dispatch(requestFinished());
            });
    } else if (!file && data.link) {
        return add(data);
    } else {
        alert("Please select a file to upload!");
    }
};

export const savePost = (data, file) => (dispatch) => {
    dispatch(requestPosts());

    const save = (media) => {
        let post = {...data, ...(media || {})};
        return $db.doc(data.id).set(post)
                .then(() => {
                    dispatch(updateState({
                        mode: 'view',
                        currentPost: post
                    }));
                    dispatch(fetchPosts);
                })
                .catch(() => {
                    alert("Can not update this item. Please try again!");
                    this.props.dispatch(requestFinished());
                });
    };

    if (file.name) {
        $storage.ref(data.fileName).delete();

        return uploadFile(file)
            .then(save)
            .catch(save)
    } else {
        return save();
    }
};

export const deletePost = (id, fileName) => (dispatch) => {
    dispatch(requestPosts());

    fileName && $storage.ref(fileName).delete();

    return $db.doc(id).delete()
        .then(() => {
            dispatch(fetchPosts);
            dispatch(resetDetail());
        })
        .catch(() => {
            alert("Can not delete this item. Please try again later!");
            dispatch(requestFinished());
        });
};