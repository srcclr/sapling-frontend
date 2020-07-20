import React from 'react';
import _ from 'lodash';
import { Trash } from 'react-feather';
import { ReturnIconWrap } from 'styles/ThemeComponents';

import { ISprint } from 'types';

interface ISprintProps {
  onDelete: (sprintId: number) => void;
  onEdit: (sprint: ISprint) => void;
  isLoading: boolean;
}

const Sprint: React.FunctionComponent<ISprint & ISprintProps> = ({
  id,
  name,
  capacity,
  goal,
  isLoading = false,
  onDelete,
  onEdit,
  children,
}) => {
  const delayedEdit = _.debounce(sprint => onEdit(sprint), 1000);

  const handleSubmit = event => {
    event.preventDefault();
    const sprintName = event.currentTarget.sprintName.value;
    const capacity = event.currentTarget.capacity.value || 0;
    const goal = event.currentTarget.goal.value || '';
    delayedEdit({ id, name: sprintName, capacity, goal } as ISprint);
  };

  return (
    <div className={` px-4 mb-4 pb-4`}>
      <div className="flex flex-row items-center">
        <div>
          <div className="tag mr-2">{id}</div>
        </div>

        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          className="flex-grow"
          key={`${id}-${name}-${capacity}-${goal}`}
        >
          <div className="flex flex-row mb-2">
            <ReturnIconWrap className="w-full">
              <input
                className=" placeholder-gray-500 mr-2 minimal text-lg font-bold"
                type="text"
                name="sprintName"
                placeholder="New sprint name"
                defaultValue={name}
              />
            </ReturnIconWrap>

            <ReturnIconWrap className="w-1/5">
              <input
                className="  placeholder-gray-500 mr-2 minimal"
                type="number"
                name="capacity"
                defaultValue={capacity}
                placeholder="Capacity (eg. 10)"
              />
            </ReturnIconWrap>
          </div>
          <div className="flex flex-row">
            <ReturnIconWrap className="w-full">
              <input
                className=" placeholder-gray-500 mr-2 minimal"
                type="text"
                name="goal"
                placeholder="Goal"
                defaultValue={goal || ''}
              />
            </ReturnIconWrap>
            <button type="submit" className="hidden" />
          </div>
        </form>
        <div className="p-4 flex-grow-0">
          <div className=" h-8 w-8 flex flex-row items-center justify-center">
            <Trash size="16" className="clickable" onClick={() => onDelete(id)} />
          </div>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Sprint;
