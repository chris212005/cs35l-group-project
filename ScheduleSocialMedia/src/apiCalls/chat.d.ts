export function createNewChat(
    users: string[]
  ): Promise<any>;
  
  export function getAllChats(): Promise<any>;
  
  export function createNewChat(members: any): Promise<any>;

  export function clearUnreadMessagesCount(chatId: string): Promise<any>;