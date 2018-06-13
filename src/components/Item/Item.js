import React, {Component} from 'react';
import './style.scss';
import {Media} from '../Media/Media';
import {updateState, createPost, deletePost, resetDetail, savePost} from "../../actions";

export class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            file: {}
        }
    }

    create() {
        this.props.dispatch(createPost(this.state.data, this.state.file))
    }

    add() {
        this.setState({
            data: {
                title: "",
                description: ""
            },
            file: {}
        });
    }

    edit() {
        const {currentPost} = this.props;

        this.props.dispatch(updateState({mode: 'edit'}));

        this.setState({
            data: JSON.parse(JSON.stringify(currentPost)),
            file: {
                type: currentPost.mediaType,
                url: currentPost.link
            }
        });
    }

    save() {
        this.props.dispatch(savePost(this.state.data, this.state.file));
    }

    delete() {
        const result = window.confirm('Are you sure you want to delete?');

        if (result) {
            const {currentPost} = this.props;
            this.props.dispatch(deletePost(currentPost.id, currentPost.fileName));
        }
    }

    close() {
        this.props.dispatch(resetDetail());
    }

    cancel() {
        this.props.dispatch(updateState({
            mode: 'view'
        }))
    }

    handleChange(field, event) {
        this.setState({data: Object.assign(this.state.data, {[field]: event.target.value})})
    }

    handleSelectFile({target: {files}}) {
        const file = files[0];

        if (file) {
            this.setState({file: file});
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setState({
                    file: Object.assign(this.state.file, {url: e.target.result})
                })
            };
            reader.readAsDataURL(file);
        }
    }

    getViewTemplate() {
        const {currentPost: data} = this.props;

        return (
            <div className="Item-content">
                <div className="Item-header d-flex align-items-center">
                    <button className="btn btn-default mr-auto" onClick={this.close.bind(this)}>Close</button>
                    <button className="btn btn-primary mr-3 ml-3" onClick={this.edit.bind(this)}>Edit</button>
                    <button className="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>
                </div>
                <div className="Item-detail">
                    <h4 className="item-title">{data.title}</h4>
                    <p>{data.description}</p>
                    <Media url={data.link} type={data.mediaType} />
                </div>
            </div>
        );
    }

    getEditTemplate() {
        return (
            <div className="Item-content">
                <div className="Item-header d-flex align-items-center justify-content-end">
                    {
                        this.props.mode === 'create'
                            ? <button className="btn btn-primary mr-3"
                                    disabled={!this.state.data.title || !this.state.file.name}
                                    onClick={this.create.bind(this)}>Create</button>
                            : <button className="btn btn-primary mr-3"
                                    disabled={!this.state.data.title}
                                    onClick={this.save.bind(this)}>Save</button>
                    }
                    <button className="btn btn-secondary" onClick={this.props.mode === 'create' ? this.close.bind(this) : this.cancel.bind(this)}>Cancel</button>
                </div>
                <div className="Item-detail">
                    <div className="form-group">
                        <input className="form-control item-title"
                                value={this.state.data.title}
                                onChange={this.handleChange.bind(this, 'title')}
                                type="text" 
                                placeholder="Title" />
                    </div>
                    <div className="form-group">
                        <textarea name="description" id="descriptionControl" rows="5"
                            className="form-control"
                            value={this.state.data.description}
                            onChange={this.handleChange.bind(this, 'description')}
                            placeholder="Description"
                        >
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="media">Preview</label>
                        <div className="input-group">
                            <label htmlFor="media" className="custom-file-label">{this.state.file.name || this.state.data.media || 'Select'}</label>
                            <input type="file" id="media"
                                   onChange={this.handleSelectFile.bind(this)}
                                   className="custom-file-input"
                                   accept=".jpg,.jpeg,.png,.mp3,.mp4,.mov"/>
                        </div>
                    </div>
                    <div className="form-group">
                        {this.props.mode !== 'create' && <Media url={this.state.file.url} type={this.state.file.type} />}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={`Item ${this.props.opening ? 'active' : ''}`}>
                {this.props.mode === 'view' ? this.getViewTemplate() : this.getEditTemplate()}
            </div>
        );
    }
}