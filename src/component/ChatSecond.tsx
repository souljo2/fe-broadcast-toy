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

@observer
class ChatSecond extends Component<IProps> {
    @observable messageStack: Array<IMessage> = [];
    @observable userInfo?: IUserInfo;

    constructor(props: IProps) {
        super(props);
        this.initUserInfo();
    }

    componentDidMount() {
        this.props.channel!.onmessage = this.handleMessage;
    }

    @action
    private initUserInfo() {
        this.userInfo = {
            id: this.getRandomString(),
            color: this.getRandomColor()
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

    public handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const { keyCode, currentTarget } = event;
        if (keyCode === 13) {
            this.sendMessage({
                ...(this.userInfo as IUserInfo),
                message: currentTarget.value
            });
            currentTarget.value = "";
        }
    };

    render() {
        return (
            <div className='App'>
                <div className='message-wrapper message-wrapper-2'>
                    {this.messageStack.map(({ id, message, color }, index) => (
                        <span className='message-line' key={index}>
                            <span className='message-line-id' style={{ color }}>
                                {this.userInfo!.id === id ? "ME" : id}
                            </span>
                            <span className='message-line-msg'>{message}</span>
                        </span>
                    ))}
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

    private getRandomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    private getRandomString(length = 7) {
        var text = "";
        var possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );

        return text;
    }
}

export default ChatSecond;
