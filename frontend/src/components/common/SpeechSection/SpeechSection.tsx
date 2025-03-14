import React from 'react';
import { Member, MessageType, FileState } from 'utils/types/entity.type';
import { Avatar } from 'components/base/Avatar';

import './SpeechSection.scss';
import { SpeechBubble } from 'components/base/SpeechBubble';
import { SystemBubble } from 'components/base/SystemBubble';
import { FileBubble } from 'components/base/FileBubble';

type Props = {
  member?: Member;
  message: string;
  loginMemberId: string;
  messageType: MessageType;
  sendDate: string;
  deleted: number;
  file?: FileState|null;
};

function SpeechSection({
  member,
  message,
  loginMemberId,
  messageType,
  sendDate,
  // deleted,
  file,
}: Props) {

  // 시스템 메시지
  if (messageType === 'system') {
    return (
      <SystemBubble message={message} />
    );
  }

  // 상대 유저 메시지
  if (!member || loginMemberId !== member.id) {
    return (
      <div className="speech-section">
        <div className="speech-section__column">
          <Avatar imageId={member?.profileImg?.name} size="large" />
        </div>
        <div className="speech-section__column speech-section__body">
          <div className="speech-section__speaker">
            {member?.name || '알수없음'}
          </div>
          {file && (<FileBubble file={file} someone={true} date={sendDate} />)}
          {
            message && (
              <SpeechBubble
                someone={true}
                message={message}
                date={sendDate}
              />
            )
          }
        </div>
      </div>
    )
  }

  // 내 메시지
  return (
    <div>
      {file && (<FileBubble file={file} someone={false} date={sendDate} />)}
      {
        message && (
          <SpeechBubble
            someone={false}
            message={message}
            date={sendDate}
          />
        )
      }
    </div>
  );
}

export default SpeechSection;