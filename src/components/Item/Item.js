import React, {Component} from 'react';
import './style.scss';
import {$db, $storage} from '../../services';
import {Media} from '../Media/Media';

export class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            file: {},
            mode: 'view',
            closed: true
        }
    }

    componentWillReceiveProps(props) {
        if (props.currentId && props.currentId !== this.props.currentId) {
            this.setState({closed: false, mode: 'view', file: {}, data: {}}, () => {
                this.fetch(props.currentId)
            });
        }
    }

    fetch(id) {
        return $db.doc(id).get()
            .then(item => this.setState({
                data: {...item.data(), ...{id: id}}
            }))
            .catch(() => alert("Can not get this item. Please try again later!"));
    }

    create() {
        this.uploadFile()
            .then(() => {
                $db.add(this.state.data)
                    .then(docRef => {
                        docRef && this.setState({
                            mode: 'view',
                            data: {...{id: docRef.id}, ...this.state.data}
                        });
                        this.props.onChange();
                    })
            })
            .catch((err) => {
                alert("Can not create this item. Please try again!");
            });
    }

    add() {
        this.state.mode !== 'create' && this.setState({
            data: {
                title: "",
                description: "",
                dateCreated: Date.now(),
                media: ""
            },
            mode: 'create',
            closed: false
        });
    }

    edit() {
        this.setState({mode: 'edit'});
    }

    save() {
        const oldFileName = this.state.data.media;
        this.uploadFile()
            .then(() => {
                if (oldFileName !== this.state.data.media) {
                    $storage.ref(oldFileName).delete();
                }
            })
            .finally(() => {
                $db.doc(this.state.data.id).set(this.state.data)
                    .then(docRef => {
                        docRef ? this.setState({
                            mode: 'view',
                            data: {...{id: docRef.id}, ...this.state.data}
                        }) : this.fetch(this.props.currentId).then(() => this.cancel());
                        this.props.onChange();
                    })
                    .catch(() => {
                        alert("Can not update this item. Please try again!");
                    });
            });
    }

    delete() {
        const result = window.confirm('Are you sure you want to delete?');

        if (result) {
            this.state.data.media && $storage.ref(this.state.data.media).delete();

            $db.doc(this.state.data.id).delete()
                .then(() => {
                    this.props.onChange(true);
                    this.setState({closed: true});
                })
                .catch(() => {
                    alert("Can not delete this item. Please try again later!")
                });
        }
    }

    close() {
        this.setState({closed: true, mode: 'view'});
    }

    cancel() {
        this.setState({mode: 'view'});
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

    uploadFile() {
        return new Promise((resolve, reject) => {
            const file = this.state.file;
            const date = Date.now();

            if (file.name) {
                $storage.ref(`${date}-${file.name}`).put(file)
                    .then(snapshot => {
                        this.setState({
                            data: Object.assign(this.state.data, {media: snapshot.ref.fullPath})
                        }, resolve);
                    })
                    .catch(reject)
            } else {
                reject();
            }
        });
    }

    getViewTemplate() {
        return (
            <div className="Item-content">
                <div className="Item-header d-flex align-items-center">
                    <button className="btn btn-default mr-auto" onClick={this.close.bind(this)}>Close</button>
                    <button className="btn btn-primary mr-3 ml-3" onClick={this.edit.bind(this)}>Edit</button>
                    <button className="btn btn-danger" onClick={this.delete.bind(this)}>Delete</button>
                </div>
                <div className="Item-detail">
                    <h4 className="item-title">{this.state.data.title}</h4>
                    <p>{this.state.data.description}</p>
                    <Media name={this.state.data.media}/>
                </div>
            </div>
        );
    }

    getEditTemplate() {
        return (
            <div className="Item-content">
                <div className="Item-header d-flex align-items-center justify-content-end">
                    {
                        this.state.mode === 'create'
                            ? <button className="btn btn-primary mr-3"
                                    disabled={!this.state.data.title || !this.state.file.name}
                                    onClick={this.create.bind(this)}>Create</button>
                            : <button className="btn btn-primary mr-3"
                                    disabled={!this.state.data.title}
                                    onClick={this.save.bind(this)}>Save</button>
                    }
                    <button className="btn btn-secondary" onClick={this.cancel.bind(this)}>Cancel</button>
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
                        {this.state.file.type
                            ? <Media url={this.state.file.url} type={this.state.file.type.split('/')[0]} />
                            : this.state.data.media && <Media name={this.state.data.media} />}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className={`Item ${!this.state.closed ? 'active' : ''}`}>
                {this.state.mode === 'view' ? this.getViewTemplate() : this.getEditTemplate()}
            </div>
        );
    }
}