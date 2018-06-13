import React, {Component} from 'react';
import './style.scss';
import Pagination from "react-js-pagination";
import {Item} from '../Item/Item';
import {CONST, CSV} from '../../utils';
import {fetchPosts, searchPostsFromNasa, selectPost, updateState} from "../../actions";

export class List extends Component {

    constructor() {
        super();
        this.myRef = undefined;
        this.inputSearch = React.createRef();
    }

    componentWillReceiveProps(props) {
        if (!props.isSearching) {
            this.inputSearch.current.value = '';
        }
    }

    exportToCSV() {
        CSV.export(this.props.data, 'NFQ-ReactApp');
    }

    create() {
        this.myRef.add();
        this.props.dispatch(updateState({
            opening: true,
            mode: 'create',
            currentPost: {},
            currentId: null
        }));
    }

    backToHome() {
        this.props.dispatch(fetchPosts);
    }

    viewDetail(post) {
        this.props.dispatch(selectPost(post));
    }

    onSearch(e) {
        if (e.key === 'Enter' && e.target.value) {
            this.props.dispatch(searchPostsFromNasa(e.target.value));
        }
    }

    handlePageChange(pageNumber) {
        this.props.dispatch(updateState({
            activePage: pageNumber
        }))
    }


    render() {
        const {data, mode, isSearching, activePage, isFetching} = this.props;
        const index = (activePage - 1) * CONST.ITEMS_PER_PAGE;
        const list = data.slice(index, index + CONST.ITEMS_PER_PAGE) || [];

        return (
            <div className={`List d-flex ${isFetching ? 'loading' : ''}`}>
                <div className="col-l">
                    <div className="list-controls mb-4">
                        {
                            isSearching &&
                            <button className="btn btn-primary"
                                    onClick={this.backToHome.bind(this)}>
                                Home
                            </button>
                        }
                        <button className="btn btn-outline-primary ml-auto"
                                disabled={mode === 'create'}
                                onClick={this.create.bind(this)}>Create
                        </button>
                        <button className="btn btn-outline-secondary ml-3"
                                disabled={!data.length}
                                onClick={this.exportToCSV.bind(this)}>Export CSV</button>
                    </div>
                    <div className="mb-5">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text">NASA</span>
                            </div>
                            <input type="text"
                                   ref={this.inputSearch}
                                   onKeyPress={this.onSearch.bind(this)}
                                   className="form-control" placeholder="Search..."/>
                        </div>
                    </div>
                    {
                        data.length
                            ?
                            (
                                <div>
                                    <ul className="list-group list-group-flush mb-4">
                                        {
                                            list.map((post) =>
                                                <li className={`list-group-item ${this.props.currentId === post.id ? 'active' : ''}`}
                                                    key={post.id}
                                                    onClick={this.viewDetail.bind(this, post)}>
                                                    <div className="d-flex align-items-center">
                                                        <div className="item-title mr-auto">{post.title}</div>
                                                        <small className="item-date pl-3">{new Date(post.dateCreated).toDateString()}</small>
                                                    </div>
                                                    <p className="item-des">{post.description}</p>
                                                </li>
                                            )
                                        }
                                    </ul>
                                    <Pagination
                                        activePage={this.props.activePage}
                                        itemsCountPerPage={CONST.ITEMS_PER_PAGE}
                                        totalItemsCount={data.length}
                                        pageRangeDisplayed={CONST.PAGE_RANGE}
                                        onChange={this.handlePageChange.bind(this)}
                                    />
                                </div>
                            )
                            :
                            <p><span className="p-3 text-white bg-info">No result was found</span></p>
                    }
                </div>
                <div className="col-r d-flex">
                    <Item {...this.props}
                        ref={instance => this.myRef = instance} />
                </div>
            </div>
        );
    }
}