import React, { Component } from 'react';
import './style.scss';
import logo from '../../logo.svg';

export class Header extends Component {

    render() {
        return (
            <header className="App-header d-flex align-items-center">
                <img src={logo} className="App-logo" alt="logo" />
                <h4 className="App-title">React App</h4>
            </header>
        );
    }
}