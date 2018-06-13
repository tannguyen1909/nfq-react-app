import React, {Component} from 'react';
import './style.scss';

const Audio = (props) => {
    return (
        <audio className="media-player" src={props.url} controls />
    );
};

const Image = (props) => {
    return (
        <img className="img-fluid" src={props.url} alt={props.name} />
    );
};

const Video = (props) => {
    return (
        <video className="media-player" src={props.url} controls />
    );
};

const MAP_TYPE = {
    "image" : Image,
    "audio" : Audio,
    "video" : Video
};

export class Media extends Component {

    getMediaControl() {
        const Control = MAP_TYPE[this.props.type.split('/')[0]] || MAP_TYPE['image'];
        return <Control url={this.props.url} name={this.props.name}/>
    }

    render() {
        const {url, type} = this.props;

        return (
            <div className="Media">
                <div className="preview">
                    {type && url && this.getMediaControl()}
                </div>
                {this.props.canDownload && <div className="actions mt-3">
                    {url && <a href={url} download className="btn btn-primary" target="_blank">Download</a>}
                </div>}
            </div>
        );
    }
}