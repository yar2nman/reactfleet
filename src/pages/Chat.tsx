import * as React from "react";
import Header from "../components/Header";
import { auth } from "../services/firebase";
import { db } from "../services/firebase";

export default class Chat extends React.Component {
    private myRef: React.RefObject<HTMLInputElement>;
    state: {
      user: firebase.User | null,
      chats: [],
      content: string,
      error?: any,
      readError: any,
      writeError: any,
      loadingChats: boolean
    }

  constructor(props: any) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      readError: null,
      writeError: null,
      loadingChats: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({ readError: null, loadingChats: true });
    const chatArea: HTMLInputElement | null = this.myRef.current;
    try {
      db.ref("chats").on("value", snapshot => {
        let chats: any[] = [];
        snapshot.forEach((snap: firebase.database.DataSnapshot) => {
          chats.push(snap.val());
        });
        chats.sort(function (a: any, b: any) { return a.timestamp - b.timestamp })
        this.setState({ chats });
        chatArea?.scrollBy(0, chatArea.scrollHeight);
        this.setState({ loadingChats: false });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

  handleChange(event: any) {
    this.setState({
      content: event.target.value
    });
  }

  async handleSubmit(event: any) {
    event.preventDefault();
    this.setState({ writeError: null });
    const chatArea = this.myRef.current;
    try {
      await db.ref("chats").push({
        content: this.state.content,
        timestamp: Date.now(),
        uid: this.state.user?.uid
      });
      this.setState({ content: '' });
      chatArea?.scrollBy(0, chatArea.scrollHeight);
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }

  formatTime(timestamp: number) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      <div>
        <Header />

        <div className="chat-area" ref={this.myRef}>
          {/* loading indicator */}
          {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div> : ""}
          {/* chat area */}
          {this.state.chats.map((chat: any) => {
            return <p key={chat.timestamp} className={"chat-bubble " + (this.state.user?.uid === chat.uid ? "current-user" : "")}>
              {chat.content}
              <br />
              <span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span>
            </p>
          })}
        </div>
        <form onSubmit={this.handleSubmit} className="mx-3">
          <textarea className="form-control" name="content" onChange={this.handleChange} value={this.state.content}></textarea>
          {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
          <button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
        </form>
        <div className="py-5 mx-3">
          Login in as: <strong className="text-info">{this.state.user?.email}</strong>
        </div>
      </div>
    );
  }
}