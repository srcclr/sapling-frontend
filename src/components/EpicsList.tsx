import React from 'react';
import { IEpic } from 'types';
import Epic from './Epic';

const EpicsList: React.FunctionComponent<{
  epics: IEpic[];
  handleDeleteEpic?: (epic: IEpic) => void;
  epicAsyncCallStateById: {
    [id: string]: {
      isLoading?: boolean;
      isSuccess?: boolean;
      isFailure?: boolean;
    };
  };
}> = ({ epics, handleDeleteEpic, epicAsyncCallStateById }) => {
  return (
    <>
      {epics && epics.length > 0 ? (
        epics.map((epic, i) => {
          const { id: epicId } = epic;
          const { [epicId]: epicCallState = {} } = epicAsyncCallStateById;
          const { isLoading: isEpicLoading = false } = epicCallState;
          return <Epic {...epic} key={i} onDelete={handleDeleteEpic} isLoading={isEpicLoading} />;
        })
      ) : (
        <div className="italic text-gray-500">No epics found</div>
      )}
    </>
  );
};

export default EpicsList;
