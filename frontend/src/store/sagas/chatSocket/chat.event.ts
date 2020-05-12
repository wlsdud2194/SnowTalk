import { Message, ChatRoom, Member } from "utils/types/entity.type";

export enum ChatEvent {
  chatError = 'chat-error',
  sendMsg = 'send-message',
  receiveMsg = 'receive-message',
  addRoomMember = 'add-room-member',
  getRooms = 'get-rooms',
  createRoom = 'create-room',
  inviteRoom = 'invite-room',
  leaveRoom = 'leave-room',
}

export interface ChatSocketResp<Data> {
  status: number;
  message?: string;
  data?: Data;
}

export type GetRoomData = {
  rooms: ChatRoom[];
};

export type SendMsgData = {
  roomIdx: number;
  message: string;
  imageIdx?: number|null;
};

export type ReceiveMsgData = {
  roomIdx: number;
  message: Message;
};

export type CreateRoomPayload = {
  membersIdx: number[];
  title?: string;
  type: 'personal'|'group';
};

export type CreateRoomData = {
  room: ChatRoom;
  members: Member[];
};

