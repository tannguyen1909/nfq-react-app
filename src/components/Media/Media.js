import React, {Component} from 'react';
import './style.scss';
import {$storage} from '../../services';

const MAP_TYPE = {
    "image" : Image,
    "audio" : Audio,
    "video" : Video
};

export class Media extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: '',
            type: ''
        };
    }

    componentWillReceiveProps(props) {
        props.name && this.getDownloadUrl(props.name);
        props.url && this.setState({
            url: props.url,
            type: props.type
        });
    }

    getDownloadUrl(name) {
        if (name) {
            const fileRef = $storage.ref(name);

            Promise.all([fileRef.getDownloadURL(), fileRef.getMetadata()])
                .then(res => {
                    this.setState({
                        url: res[0],
                        type: res[1].contentType.split('/')[0]
                    })
                })
                .catch(() => {
                    this.setState({url: '', type: ''})
                });
        }
    }

    getMediaControl() {
        const Control = MAP_TYPE[this.state.type];
        return <Control url={this.state.url} name={this.state.name}/>
    }

    render() {
        return (
            <div className="Media">
                <div className="preview">
                    {this.state.type && this.state.url && this.getMediaControl()}
                </div>
                <div className="actions mt-3">
                    {this.state.url && <a href={this.state.url} download className="btn btn-primary" target="_blank">Download</a>}
                </div>
            </div>
        );
    }
}

function Audio(props) {
    return (
        <audio className="media-player" src={props.url} controls />
    );
}

function Image(props) {
    return (
        <img className="img-fluid" src={props.url} alt={props.name} />
    );
}

function Video(props) {
    return (
        <video className="media-player" src={props.url} controls />
    );
}