import React from 'react';
import Story from './Story';
import { IStory } from 'types';

const StoriesList: React.FunctionComponent<{
  sprintId?: number;
  stories: IStory[];
  activeStoryId: number;
  emptyListMessage?: string;
  storyAsyncCallStateById: {
    [id: string]: {
      isLoading?: boolean;
      isSuccess?: boolean;
      isFailure?: boolean;
    };
  };
}> = ({
  sprintId,
  stories,
  activeStoryId,
  storyAsyncCallStateById,
  emptyListMessage = 'No stories found',
}) => {
  return (
    <div className="flex flex-wrap">
      {stories && stories.length > 0 ? (
        stories.map((story, i) => {
          const { id: storyId } = story;
          const { [storyId]: storyCallState = {} } = storyAsyncCallStateById;
          const { isLoading: isStoryLoading = false } = storyCallState;
          return (
            <Story
              key={i}
              {...story}
              isLoading={isStoryLoading}
              isAddingDependency={storyId === activeStoryId}
              sprintId={sprintId}
            />
          );
        })
      ) : (
        <div className="italic text-gray-500">{emptyListMessage}</div>
      )}
    </div>
  );
};

export default StoriesList;
