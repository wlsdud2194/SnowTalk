import produce from 'immer';
import { createAction, ActionType, createReducer } from "typesafe-actions";
import { findIndex } from 'lodash';
import { ChatRoom } from "utils/types/entity.type";
import {
  GetRoomData, 
  ReceiveMsgData, 
  SendMsgData, 
  CreateRoomPayload, 
  CreateRoomData, 
  LeaveRoomData, 
  InviteRoomPayload,
  InviteRoomData,
} from "store/sagas/chatSocket/chat.event";

type ChatSocketState = {
  chatRooms: ChatRoom[];
};

export const initalState: ChatSocketState = {
  chatRooms: [],
}

export const SUBSCRIBE_CHAT_SOCKET = 'SUBSCRIBE_CHAT_SOCKET';
export const UNSUBSCRIBE_CHAT_SOCKET = 'UNSUBSCRIBE_CHAT_SOCKET';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const EMIT_GET_ROOMS = 'EMIT_GET_ROOMS';
export const RECEIVE_GET_ROOMS = 'RECEIVE_GET_ROOMS';
export const EMIT_CREATE_ROOM = 'EMIT_CREATE_ROOM';
export const RECEIVE_CREATE_ROOM = 'RECEIVE_CREATE_ROOM';
export const EMIT_LEAVE_ROOM = 'EMIT_LEAVE_ROOM';
export const RECEIVE_LEAVE_ROOM = 'RECEIVE_LEAVE_ROOM';
export const RECEIVE_LEAVE_ROOM_MEMBER = 'RECEIVE_LEAVE_ROOM_MEMBER';
export const EMIT_INVITE_ROOM = 'EMIT_INVITE_ROOM';
export const RECEIVE_INVITE_ROOM = 'RECEIVE_INVITE_ROOM';

export const subscribeChatSocket = createAction(SUBSCRIBE_CHAT_SOCKET)();
export const unsubscribeChatSocket = createAction(UNSUBSCRIBE_CHAT_SOCKET)();
export const sendMessage = createAction(SEND_MESSAGE)<SendMsgData>();
export const receiveMessage = createAction(RECEIVE_MESSAGE)<ReceiveMsgData>();
export const emitGetRooms = createAction(EMIT_GET_ROOMS)();
export const receiveGetRooms = createAction(RECEIVE_GET_ROOMS)<GetRoomData>();
export const emitCreateRoom = createAction(EMIT_CREATE_ROOM)<CreateRoomPayload>();
export const receiveCreateRoom = createAction(RECEIVE_CREATE_ROOM)<CreateRoomData>();
export const emitLeaveRoom = createAction(EMIT_LEAVE_ROOM)<{ roomIdx: number }>();
export const receiveLeaveRoom = createAction(RECEIVE_LEAVE_ROOM)<LeaveRoomData>();
export const receiveLeaveRoomMember = createAction(RECEIVE_LEAVE_ROOM_MEMBER)<LeaveRoomData>();
export const emitInviteRoom = createAction(EMIT_INVITE_ROOM)<InviteRoomPayload>();
export const receiveInviteRoom = createAction(RECEIVE_INVITE_ROOM)<InviteRoomData>();

const actions = {
  subscribeChatSocket,
  unsubscribeChatSocket,
  sendMessage,
  receiveMessage,
  emitGetRooms,
  receiveGetRooms,
  emitCreateRoom,
  receiveCreateRoom,
  emitLeaveRoom,
  receiveLeaveRoom,
  receiveLeaveRoomMember,
  emitInviteRoom,
  receiveInviteRoom,
};
export type ChatSocketActions = ActionType<typeof actions>;

export default createReducer<ChatSocketState, ChatSocketActions>(initalState, {
  [RECEIVE_GET_ROOMS]: (state, action) => ({
    ...state,
    chatRooms: action.payload.rooms,
  }),
  [RECEIVE_MESSAGE]: (state, { payload }) => {
    console.log(payload);
    const { roomIdx, message } = payload;

    return produce(state, draft => {
      draft.chatRooms.map((chatRoom) => {
        if (chatRoom.idx === roomIdx) {
          chatRoom.messages = [message, ...chatRoom.messages];
        }
        return chatRoom;
      });
    });
  },
  [RECEIVE_CREATE_ROOM]: (state, action) => 
    produce(state, draft => {
      draft.chatRooms.unshift(action.payload.room);
    }),
  [RECEIVE_LEAVE_ROOM]: (state, action) => 
    produce(state, draft => {
      draft.chatRooms = draft.chatRooms.filter((chatRoom) => 
        chatRoom.idx !== action.payload.roomIdx);
    }),
  [RECEIVE_LEAVE_ROOM_MEMBER]: (state, action) => 
    produce(state, draft => {
      draft.chatRooms = draft.chatRooms.map(chatRoom => {
        const idx = findIndex(chatRoom.participants, { 'idx': action.payload.participantIdx });
        if (idx >= 0) {
          chatRoom.participants.splice(idx, 1);
        }

        return chatRoom;
      });
    }),
});
