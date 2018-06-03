const list = (state = [], action) => {
    switch (action.type) {
        case 'SHOW_ALL':
            return [
                ...state,
                {
                    //TODO
                }
            ];
        default:
            return state
    }
};

export default list;