export interface Message {
  chatId: string; // The ID of the chat
  sender: string; // The ID of the sender
  text: string; // The message content
  createdAt?: string; // Optional: Timestamp of when the message was created
  updatedAt?: string; // Optional: Timestamp of when the message was last updated
}

export declare const createNewMessage: (message: Message) => Promise<any>;

export declare const getAllMessages: (chatId: string) => Promise<any>;