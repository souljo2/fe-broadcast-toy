import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";

import ChatFirst from "./component/ChatFirst";
import ChatSecond from "./component/ChatSecond";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

interface IProps {}

@observer
class App extends Component<IProps> {
    @observable channel?: BroadcastChannel;

    constructor(props: IProps) {
        super(props);
        this.initChannel();
    }

    @action
    private initChannel() {
        this.channel = new BroadcastChannel("TEST");
    }

    render() {
        return (
            <BrowserRouter>
                <Route
                    path='/test1'
                    render={props => (
                        <ChatFirst channel={this.channel} {...props} />
                    )}
                />
                <Route
                    path='/test2'
                    render={props => (
                        <ChatSecond channel={this.channel} {...props} />
                    )}
                />
            </BrowserRouter>
        );
    }
}

export default App;
