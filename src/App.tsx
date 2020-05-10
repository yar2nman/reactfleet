import * as React from "react";
import {Component} from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { auth } from "./services/firebase";
import './styles.css';


// function PrivateRoute(props: { component: Component, authenticated: boolean, path: string, rest?: any[]}) {
//   if (props.authenticated) {
//     return(
//       <Route 
//         {...props.rest}
//         render = {
//           props => (<Component {...props} />)
//         }
//       />
//     )
//   }else{
//     return(
//       <Redirect
//               to={{ pathname: "/login", state: { from: "/" } }}
//             />
//     )
//   }
  
// }

// function PublicRoute(inp: { component: Component, authenticated: boolean, path: string, rest?: any[]}) {
//   return (
//     <Route
//       {...inp.rest}
//       render={props =>
//         inp.authenticated === false ? (
//           <Component {...props} />
//         ) : (
//             <Redirect to="/chat" />
//           )
//       }
//     />
//   );
// }

class App extends React.Component {
  state: {
    authenticated: boolean,
      loading: boolean
  }
  constructor(props: any) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true
    };
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    });
  }

  render() {
    return this.state.loading === true ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/chat"
              component={Chat}
            />
            <Route
              path="/signup"
              component={Signup}
            />
            <Route
              path="/login"
              component={Login}
            />
          </Switch>
        </Router>
      );
  }
}

export default App;