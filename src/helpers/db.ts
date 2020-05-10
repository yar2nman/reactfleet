import { db } from "../services/firebase";

export function readChats() {
  let abc: any[] = [];
  db.ref("chats").on("value", snapshot => {
    snapshot.forEach(snap => {
      abc.push(snap.val())
    });
    return abc;
  });
}

export function writeChats(message: any) {
  return db.ref("chats").push({
    content: message.content,
    timestamp: message.timestamp,
    uid: message.uid
  });
}