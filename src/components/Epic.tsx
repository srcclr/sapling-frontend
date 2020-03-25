import React, { useCallback } from 'react';
import _ from 'lodash';
import { IEpic } from 'types';
import { Trash } from 'react-feather';
import Loader from 'react-loader-spinner';

interface IEpicProps {
  onDelete: (epic: IEpic) => void;
  isLoading: boolean;
}

const Epic: React.FunctionComponent<IEpic & IEpicProps> = ({
  id,
  name,
  priority,
  onDelete,
  isLoading,
}) => {
  return (
    <div className={`pb-4 ${isLoading ? 'opacity-50' : ''}`}>
      <div className="flex flex-row items-center">
        <div className="flex-grow flex flex-row justify-between">
          <div className="text-sm pr-1">{name}</div>
          <div className="text-sm">{priority}</div>
        </div>
        <div className="px-2 flex-grow-0">
          <div className="h-8 w-8 flex flex-row items-center justify-center">
            {isLoading ? (
              <Loader type="Grid" width={13} height={13} />
            ) : (
              <Trash
                size="16"
                className="clickable"
                onClick={() => onDelete({ id, name, priority })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Epic;
