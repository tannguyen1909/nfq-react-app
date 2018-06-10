import React, {Component} from 'react';
import './style.scss';
import {Loading} from '../Loading/Loading';
import {Item} from '../Item/Item';
import {CSV} from '../../utils';
import {selectPost} from "../../actions";

export class List extends Component {

    constructor() {
        super();
        this.myRef = undefined;
    }

    exportToCSV() {
        CSV.export(this.props.posts, 'NFQ-ReactApp');
    }

    create() {
        this.myRef.add();
        this.props.dispatch(selectPost(null))
    }

    onChange(isClosed, noRefresh) {
        !noRefresh && this.fetch();
        isClosed && this.props.dispatch(selectPost(null));
    }

    viewDetail(id) {
        const {dispatch} = this.props;
        dispatch(selectPost(id));
    }

    render() {
        return (
            <div className="List d-flex">
                <div className="col-l">
                    <div className="list-controls mb-5">
                        <button className="btn btn-outline-primary mr-3"
                            onClick={this.create.bind(this)}>Create
                        </button>
                        <button className="btn btn-outline-secondary"onClick={this.exportToCSV.bind(this)}>Export CSV</button>
                    </div>
                    <ul className="list-group list-group-flush">
                        {
                            this.props.posts.map(file =>
                                <li className={`list-group-item ${this.props.currentId === file.id ? 'active' : ''}`}
                                    key={file.id}
                                    onClick={this.viewDetail.bind(this, file.id)}>
                                    <div className="d-flex align-items-center">
                                        <div className="item-title mr-auto">{file.title}</div>
                                        <small className="item-date pl-3">{new Date(file.dateCreated).toDateString()}</small>
                                    </div>
                                    <p className="item-des">{file.description}</p>
                                </li>
                            )
                        }
                    </ul>
                </div>
                <div className="col-r d-flex">
                    <Item currentId={this.props.currentId}
                          ref={instance => this.myRef = instance}
                          onChange={this.onChange.bind(this)}/>
                </div>
                {this.props.isFetching ? <Loading /> : ''}
            </div>
        );
    }
}