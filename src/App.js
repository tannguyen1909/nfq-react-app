import React, {Component} from 'react';
import './App.scss';
import {Header, List} from './components';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <main>
                    <List/>
                </main>
            </div>
        );
    }
}

export default App;
