import React, {Component} from 'react';
import './App.scss';
import {connect} from 'react-redux';
import {Header, List, Loading} from './components';
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
                    {this.props.isFetching && <Loading />}
                </main>
            </div>
        )
    }
}

const mapStateToProps = ({posts: state}) => {
    return state;
};

export default connect(mapStateToProps)(App);