import React, { useState } from 'react';
import { INotification, STORY_REQUEST_ACTION } from 'types';

const NotificationsList: React.FunctionComponent<{
  notifications: INotification[];
  onAcceptOrRejectStoryRequest?: (
    storyRequestId: number,
    action: STORY_REQUEST_ACTION,
    note: string
  ) => void;
}> = ({ notifications, onAcceptOrRejectStoryRequest }) => {
  const [inputNotes, setInputNotes] = useState({});

  return (
    <>
      {notifications && notifications.length > 0 ? (
        notifications.map((notification: INotification, i) => {
          const {
            storyRequestId,
            epic,
            sender: senderBoard,
            notes,
            points,
            description,
            sprint,
          } = notification;
          return (
            <div key={i} className="border-b-2 border-dotted border-gray-200 pb-4 mb-4">
              <div className="text-sm">
                <span className="font-black">{senderBoard}</span> has requested to add a story "
                <span className="font-black">{description}</span>" to this board in sprint{' '}
                <span className="font-black">{sprint}</span>, epic{' '}
                <span className="font-black">{epic}</span>
              </div>{' '}
              {notes && (
                <div className="border-l-2 border-gray-500 pl-2 text-sm mt-2">
                  Notes:
                  <div>{notes}</div>
                </div>
              )}
              <div className="mt-2">
                <div>
                  <input
                    className="text-sm"
                    placeholder="Notes (eg Rejecting because...)"
                    onChange={e =>
                      setInputNotes({
                        ...inputNotes,
                        [storyRequestId]: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-row mt-2">
                  <button
                    className="btn btn-minimal text-sm w-1/2 mr-2"
                    onClick={() =>
                      onAcceptOrRejectStoryRequest(
                        storyRequestId,
                        STORY_REQUEST_ACTION.Reject,
                        inputNotes[storyRequestId] || ''
                      )
                    }
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-primary py-1 text-sm w-1/2"
                    onClick={() =>
                      onAcceptOrRejectStoryRequest(
                        storyRequestId,
                        STORY_REQUEST_ACTION.Accept,
                        inputNotes[storyRequestId] || ''
                      )
                    }
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="italic text-teal-600 text-sm">No new notifications</div>
      )}
    </>
  );
};

export default NotificationsList;
