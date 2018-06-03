import React, {Component} from 'react';
import './style.scss';
import {$db} from '../../services';
import {Loading} from '../Loading/Loading';
import {Item} from '../Item/Item';
import {CSV} from '../../utils';

export class List extends Component {

    constructor() {
        super();
        this.state = {
            data: [],
            loading: true,
            currentId: null
        };
        this.myRef = undefined;
    }

    componentWillMount() {
        this.fetch();
    }

    exportToCSV() {
        window.open(CSV.getCSV(this.state.data));
    }

    create() {
        this.myRef.add();
        this.setState({currentId: null});
    }

    fetch() {
        let list = [];
        $db.orderBy("dateCreated", "desc").get().then(querySnapshot => {
            querySnapshot.forEach(file => {
                list.push({...{id: file.id}, ...file.data()});
            });
            this.setState({data: list, loading: false});
        })
    }

    onChange(isClosed) {
        this.fetch();
        isClosed && this.setState({currentId: null});
    }

    viewDetail(id) {
        this.setState({currentId: id});
    }

    render() {
        return (
            this.state.loading 
                ?   <Loading /> 
                :   <div className="List d-flex">
                        <div className="col-l">
                            <div className="list-controls mb-5">
                                <button className="btn btn-outline-primary mr-3"
                                    onClick={this.create.bind(this)}>Create
                                </button>
                                <button className="btn btn-outline-secondary"onClick={this.exportToCSV.bind(this)}>Export CSV</button>
                            </div>
                            <ul className="list-group list-group-flush">
                                {
                                    this.state.data.map(file => 
                                        <li className={`list-group-item ${this.state.currentId === file.id ? 'active' : ''}`}
                                            key={file.id}
                                            onClick={this.viewDetail.bind(this, file.id)}>
                                            <div className="d-flex align-items-center">
                                                <div className="item-title mr-auto">{file.title}</div>
                                                <small className="item-date pl-3">{new Date(file.dateCreated).toDateString()}</small>
                                            </div>
                                            <p>{file.description}</p>
                                        </li>
                                    )
                                }    
                            </ul>
                        </div>
                        <div className="col-r">
                            <Item currentId={this.state.currentId}
                                  ref={instance => this.myRef = instance}
                                  onChange={this.onChange.bind(this)}/>
                        </div>
                    </div>       
        );
    }
}