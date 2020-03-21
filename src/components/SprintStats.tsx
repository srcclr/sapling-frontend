import React from 'react';

const SprintStats: React.FunctionComponent<{
  storiesCount: number;
  currentLoadCount: number;
  loadLeftCount: number;
}> = ({ storiesCount, currentLoadCount, loadLeftCount }) => {
  return (
    <div className="flex flex-row justify-end mt-2 mb-2 text-sm ">
      <div className="flex flex-row bg-gray-200 p-1 rounded-md">
        <div className="mr-2">
          <div className="inline-block mr-1">Stories</div>
          <div className="rounded-md bg-gray-100 inline-block center px-2">{storiesCount}</div>
        </div>
        <div className="mr-2">
          <div className="inline-block mr-1">Current load</div>
          <div className="rounded-md bg-gray-100 inline-block center px-2">{currentLoadCount}</div>
        </div>
        <div className="mr-2">
          {loadLeftCount >= 0 && <div className="inline-block mr-1">Load left</div>}
          {!isNaN(loadLeftCount) ? (
            <div
              className={`rounded-md bg-gray-100 inline-block center px-2 ${
                loadLeftCount < 0 ? 'text-red-400' : ''
              }`}
            >
              {loadLeftCount >= 0 ? loadLeftCount : `Load exceeds by ${Math.abs(loadLeftCount)}`}
            </div>
          ) : (
            <div>-</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintStats;
