export interface MessageInterface {
  idRoom: string;
  idSender: string;
  idSentTo?: string;
  message: string;
  sendTo?: string;
  sender: string;
}
