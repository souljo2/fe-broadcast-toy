import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import "../App.css";

interface IMessage extends IUserInfo {
    message: string;
}

interface IUserInfo {
    id: string;
    color: string;
}

interface IProps {
    channel?: BroadcastChannel;
}

export default function BuildChatComponent(type?: number) {
    const classSet = `message-wrapper message-wrapper-${type}`;

    @observer
    class Chat extends Component<IProps> {
        @observable messageStack: Array<IMessage> = [];
        @observable userInfo?: IUserInfo;

        constructor(props: IProps) {
            super(props);
            this.initUserInfo();
        }

        public render() {
            return (
                <div className='App'>
                    <div className={classSet}>
                        {this.messageStack.map(
                            ({ id, message, color }, index) => (
                                <span className='message-line' key={index}>
                                    <span
                                        className='message-line-id'
                                        style={{ color }}
                                    >
                                        {this.userInfo!.id === id ? "ME" : id}
                                    </span>
                                    <span className='message-line-msg'>
                                        {message}
                                    </span>
                                </span>
                            )
                        )}
                    </div>
                    <div className='message-input-wrapper'>
                        <label className='message-input-label'>Message</label>
                        <input
                            className='message-input'
                            type='text'
                            onKeyDown={this.handleKeyDown}
                        />
                    </div>
                </div>
            );
        }

        public componentDidMount() {
            this.props.channel!.onmessage = this.handleMessage;
        }

        public handleKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            const { keyCode, currentTarget } = event;
            if (keyCode === 13) {
                const message = currentTarget.value;

                if (message) {
                    this.sendMessage({
                        ...(this.userInfo as IUserInfo),
                        message
                    });
                    currentTarget.value = "";
                }
            }
        };

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        @action
        private initUserInfo() {
            this.userInfo = {
                id: getRandomString(),
                color: getRandomColor()
            };
        }

        @action
        private handleMessage = (ev: MessageEvent) => {
            this.messageStack.push(ev.data as IMessage);
        };

        @action
        public sendMessage(msg: IMessage) {
            this.props.channel!.postMessage(msg);
            this.messageStack.push(msg);
        }
    }

    return Chat;
}

const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const getRandomString = (length = 7) => {
    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
