import React, {Component} from 'react';
import './style.scss';
import {Spinner} from "..";

const Audio = (props) => {
    return (
        <audio className="media-player"
               onCanPlay={props.onLoaded}
               src={props.url} controls />
    );
};

const Image = (props) => {
    return (
        <img className="media-player"
             onLoad={props.onLoaded}
             src={props.url} alt={props.name} />
    );
};

const Video = (props) => {
    return (
        <video className="media-player"
               onCanPlay={props.onLoaded}
               src={props.url} controls />
    );
};

const MAP_TYPE = {
    "image" : Image,
    "audio" : Audio,
    "video" : Video
};

export class Media extends Component {

    constructor(props) {
        super(props);
        this.state = {loading: true};
        this.url = props.url;
    }

    componentWillReceiveProps(props) {
        if (props.url !== this.url) {
            this.url = props.url;
            this.setState({loading: true});
        }
    }

    onLoaded() {
        this.setState({loading: false});
    }

    getMediaControl() {
        const Control = MAP_TYPE[this.props.type.split('/')[0]] || MAP_TYPE['image'];
        return <Control url={this.props.url}
                        name={this.props.name}
                        onLoaded={this.onLoaded.bind(this)}/>
    }

    render() {
        const {url, type} = this.props;

        return (
            <div className="Media">
                {this.state.loading && <div className='spinner-wrapper'><Spinner /></div>}
                <div className={`preview ${this.state.loading ? 'loading' : ''}`}>
                    {type && url && this.getMediaControl()}
                </div>
                {this.props.canDownload && !this.state.loading && <div className="actions mt-3">
                    {url && <a href={url} download className="btn btn-primary" target="_blank">Download</a>}
                </div>}
            </div>
        );
    }
}