import React from 'react';
import './App.css';
import {Switch, Route, Redirect} from "react-router-dom";
import {Login} from "./views/Login/Login";
import {CustomBrowserRouter} from "./CustomBrowserRouter";
import {Home} from "./views/Home/Home";

function App() {
    return (
        <>
            <CustomBrowserRouter>
                <Switch>
                    <Route exact path={'/'} render={() => (<Redirect to={'/login'}/>)}/>
                    <Route exact path={'/login'} component={Login}/>
                    <Route exact path={'/home'} component={Home}/>
                    <Route component={() => <h1>404 Not Found</h1>}/>
                </Switch>
            </CustomBrowserRouter>
        </>
    );
}

export default App;
