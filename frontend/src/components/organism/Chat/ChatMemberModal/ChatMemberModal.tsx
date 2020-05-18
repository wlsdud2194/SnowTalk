import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { map } from 'lodash';

import { RootState } from 'store/reducers';
import useInput from 'utils/hooks/useInput';
import { Participant, Member } from 'utils/types/entity.type';
import { Button } from 'components/base/Button';
import { Input } from 'components/base/Input';
import { UserCard } from 'components/common/UserCard';
import { NameTag } from 'components/base/NameTag';

import './ChatMemberModal.scss';

type Props = {
  onClose: () => void;
  type: 'create'|'invite';
  roomIdx?: number;
  participants?: Participant[]; // 기존에 있었던 회원
}

function ChatMemberModal({ onClose, type, roomIdx, participants = [] }: Props) {
  const dispatch = useDispatch();
  const { user, friends } = useSelector((state: RootState) => state.member);
  const [invitedMembers, setInvitedMembers] = useState<Member[]>([]);
  const searchName = useInput('');

  const participantIdxs = map(participants, 'member.idx');
  const invitedMemberIdxs = map(invitedMembers, 'idx');

  const onAddInvite = useCallback((member: Member) => {
    setInvitedMembers((prevMembers) => [...prevMembers, member]);
  }, []);

  const onDeleteInvitedId = useCallback((idx: number) => {
    setInvitedMembers(invitedMembers.filter(member => member.idx !== idx));
  }, [invitedMembers]);

  const onSubmit = useCallback(() => {
    if (type === 'create') {

    } else if (type === 'invite' && roomIdx) {

    }

    onClose();
  }, [onClose, roomIdx, type]);

  // 초대되지 않은 친구 목록
  const friendNodes = friends.map((friend) => {
    if (
      invitedMemberIdxs.indexOf(friend.idx) >= 0 
      || participantIdxs.indexOf(friend.idx) >= 0
      || !friend.name.match(searchName.value)
    ) {
      return null;
    }

    return (
      <UserCard
        key={friend.idx} title={friend.name}
        type="profile"
        imgIds={friend.profileImg !== null ? [
          friend.profileImg.name,
        ]:[]}
        additionalInfo={(
          <div>
            <Button
              type="secondary" 
              onClick={() => onAddInvite(friend)}
            >추가</Button>
          </div>
        )}
      />
    );
  });

  return (
    <div className="chat-member-modal">
      <div className="chat-member-modal__title">대화상대 초대</div>
      <div className="chat-member-modal__invited">
        <NameTag 
          name={user.name} 
          itemNode={<div>(나)</div>} 
          highlight />
        {
          participants.map(p => (
            <NameTag key={p.idx} name={p.member?.name || '알수 없음'} highlight />
          ))
        }
        {
          invitedMembers.map(m => (
            <NameTag 
              key={m.idx}
              name={m.name} 
              onClose={() => onDeleteInvitedId(m.idx)} 
              btnVisible  />
          ))
        }
      </div>
      <div className="chat-member-modal__search">
        <Input
          placeholder="이름으로 검색"
          value={searchName.value} 
          onChange={searchName.onChange} />
      </div>

      <div className="chat-member-modal__friends">
        {friendNodes}
      </div>
      <div className="chat-member-modal__btnGroup">
        <div>
          <Button type="primary" onClick={onSubmit}>{type==='create'? '채팅방 생성':'초대'}</Button>
        </div>
        <div><Button type="secondary" onClick={onClose}>취소</Button></div>
      </div>
    </div>
  );
}

export default ChatMemberModal;