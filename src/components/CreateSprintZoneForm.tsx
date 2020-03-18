import React, { useState } from 'react';
import { ActionZone } from 'styles/ThemeComponents';
import { ISprint } from 'types';

const CreateSprintZoneForm = ({ onSubmit }: { onSubmit: (sprint: ISprint) => void }) => {
  const [a, setA] = useState(false);
  const handleSubmit = event => {
    event.preventDefault();
    const sprintName = event.currentTarget.sprintName.value;
    const capacity = event.currentTarget.capacity.value;
    const goal = event.currentTarget.goal.value;
    onSubmit({ name: sprintName, capacity, goal });
    event.currentTarget.reset();
    setA(false);
  };

  return (
    <ActionZone actionName="Add Sprint" isActive={a} withHandle={false} minimal={true}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row mb-2">
          <input
            className=" placeholder-gray-500 mr-2"
            type="text"
            name="sprintName"
            placeholder="New sprint name"
            autoFocus={a}
            required
          />
          <input
            className=" w-1/3 placeholder-gray-500 mr-2"
            type="number"
            name="capacity"
            placeholder="Capacity (eg. 10)"
          />{' '}
        </div>
        <div className="flex flex-row">
          <input
            className=" placeholder-gray-500 mr-2"
            type="text"
            name="goal"
            placeholder="Goal"
          />
          <button className="btn btn-primary mr-2" type="submit">
            Add
          </button>
        </div>
      </form>
    </ActionZone>
  );
};

export default CreateSprintZoneForm;
