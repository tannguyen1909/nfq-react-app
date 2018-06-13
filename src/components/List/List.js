import React, {Component} from 'react';
import './style.scss';
import {Loading} from '../Loading/Loading';
import {Item} from '../Item/Item';
import {CSV} from '../../utils';
import {fetchPosts, searchPostsFromNasa, selectPost, updateState} from "../../actions";

export class List extends Component {

    constructor() {
        super();
        this.myRef = undefined;
        this.inputSearch = React.createRef();
    }

    exportToCSV() {
        CSV.export(this.props.posts, 'NFQ-ReactApp');
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
        this.inputSearch.current.value = '';
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

    render() {
        const {data, mode, isSearching} = this.props;

        return (
            <div className="List d-flex">
                <div className="col-l">
                    <div className="list-controls mb-3">
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
                    <ul className="list-group list-group-flush mb-4">
                        {
                            data.map((post) =>
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
                </div>
                <div className="col-r d-flex">
                    <Item {...this.props}
                        ref={instance => this.myRef = instance} />
                </div>
                {this.props.isFetching ? <Loading /> : ''}
            </div>
        );
    }
}