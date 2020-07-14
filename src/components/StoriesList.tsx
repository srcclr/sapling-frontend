import React from 'react';
import Story from './Story';
import { IStory, IStoryFilters } from 'types';

const StoriesList: React.FunctionComponent<{
  sprintId?: number;
  stories: IStory[];
  activeStoryId: number;
  emptyListMessage?: string;
  filters: IStoryFilters;
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
  filters = { epic: -1 },
}) => {
  const { epic: epicFilter } = filters;

  return (
    <div className="flex flex-wrap">
      {stories && stories.length > 0 ? (
        stories.map((story, i) => {
          const { id: storyId, epic } = story;
          const { [storyId]: storyCallState = {} } = storyAsyncCallStateById;
          const { isLoading: isStoryLoading = false } = storyCallState;

          const isDimmed = epicFilter !== -1 && epicFilter !== epic;
          return (
            <Story
              key={i}
              {...story}
              isLoading={isStoryLoading}
              isAddingDependency={storyId === activeStoryId}
              sprintId={sprintId}
              isDimmed={isDimmed}
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
