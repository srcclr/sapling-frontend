import React, { useState } from 'react';
import { IBoard, STORY_REQUEST_ACTION, IStoryRequestWithViewData, IStoryRequest } from 'types';
import { getStoryRequestActionByState } from 'utils/Helpers';

const CrossBoardDependenciesList: React.FunctionComponent<{
  boardList: IBoard[];
  dependencies: IStoryRequest[];
  onActionClick: (
    action: STORY_REQUEST_ACTION,
    storyRequestData: IStoryRequestWithViewData
  ) => void;
}> = ({ boardList, dependencies, onActionClick }) => {
  return (
    <div>
      {dependencies &&
        dependencies.map((dependency, i) => {
          const { boardId, state } = dependency;
          const board = boardList.find(board => board.id === boardId) || {};

          const { name: depBoardName } = board;
          const storyRequestData: IStoryRequestWithViewData = {
            ...dependency,
            storyBoardName: depBoardName,
          };
          const nextAction = getStoryRequestActionByState(state);
          return (
            <div key={i} className="px-1 border-b-2 border-gray-300 mb-1">
              <div className="font-semibold">{depBoardName}</div>
              {state}{' '}
              <a
                className={'cursor-pointer p-2 inline-block'}
                onClick={() => onActionClick(nextAction, storyRequestData)}
              >
                {nextAction}
              </a>
            </div>
          );
        })}
    </div>
  );
};

export default CrossBoardDependenciesList;
