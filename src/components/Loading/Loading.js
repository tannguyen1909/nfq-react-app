import React, {Component} from 'react';
import './style.scss';

export class Loading extends Component {
    render() {
        return (
            <div className="Loading">
                <div className="cssload-loader">
                    <div className="cssload-inner cssload-one" />
                    <div className="cssload-inner cssload-two" />
                    <div className="cssload-inner cssload-three" />
                </div>
            </div>
        );
    }
}