import React, { useState } from 'react';
import { IBoard, ICrossBoardData } from 'types';
import { hasEmptyOption } from 'utils/Helpers';
import { Dropdown } from 'styles/ThemeComponents';
import Loader from 'react-loader-spinner';

const CrossBoardDependencies: React.FunctionComponent<{
  boardList: IBoard[];
  onBoardSelect: Function;
  data: ICrossBoardData;
  isFetching: boolean;
  onSubmitRequest: Function;
}> = ({ boardList = [], onBoardSelect, data = {}, isFetching, onSubmitRequest, children }) => {
  const { sprints = [], epics = [], boardId } = data;

  const handleBoardSelect = (field, value) => {
    onBoardSelect(value);
  };

  const boardListOptions = boardList.map(board => {
    const { id, name } = board;
    return {
      value: id,
      label: name,
    };
  });

  const epicOptions = epics.map(epic => {
    const { id, name } = epic;
    return {
      value: id,
      label: name,
    };
  });

  const sprintOptions = sprints.map(sprint => {
    const { id, name } = sprint;
    return {
      value: id,
      label: name,
    };
  });

  const [fieldValues, setFieldValues] = useState({});
  const handleFieldChange = (name, value) => {
    setFieldValues({ ...fieldValues, [name]: value });
  };

  const hasEpicsAndSprints = epicOptions.length && sprintOptions.length;

  const handleSubmit = event => {
    event.preventDefault();
    onSubmitRequest({ ...fieldValues, boardId });
  };
  return (
    <div>
      <Dropdown
        name="boardId"
        options={hasEmptyOption(boardListOptions)}
        onChange={handleBoardSelect}
      />
      {isFetching ? (
        <div className="flex justify-center">
          <Loader type="ThreeDots" color="#aaaaaa" width={20} height={20} />
        </div>
      ) : boardId && hasEpicsAndSprints ? (
        <div>
          <form onSubmit={handleSubmit}>
            <Dropdown
              name="storyEpicId"
              options={hasEmptyOption(epicOptions)}
              onChange={handleFieldChange}
              required={true}
            />
            <Dropdown
              name="storySprintId"
              options={hasEmptyOption(sprintOptions)}
              onChange={handleFieldChange}
              required={true}
            />
            <input
              className="w-full "
              type="text"
              name="notes"
              placeholder="notes"
              onChange={e => handleFieldChange('notes', e.target.value)}
            />
            <button className="btn btn-primary w-full" type="submit">
              Send Request
            </button>
          </form>
        </div>
      ) : boardId && !hasEpicsAndSprints ? (
        <div className="p-1 italic text-red-400">
          Target board has no epics or sprints. Dependency is unavailable.
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default CrossBoardDependencies;
