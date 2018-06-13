import React, {Component} from 'react';
import './App.scss';
import {connect} from 'react-redux';
import {Header, List} from './components';
import {fetchPosts} from './actions';

class App extends Component {

    componentDidMount() {
        this.props.dispatch(fetchPosts);
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <main>
                    <List {...this.props}/>
                </main>
            </div>
        );
    }
}

const mapStateToProps = ({posts: state}) => {
    return state;
};

export default connect(mapStateToProps)(App);