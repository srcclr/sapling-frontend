import React, { useState } from 'react';
import { ActionZone } from 'styles/ThemeComponents';

const CreateSprintZoneForm = ({
  onSubmit,
}: {
  onSubmit: (sprintName: string, capacity: number) => void;
}) => {
  const [a, setA] = useState(false);
  const handleSubmit = event => {
    event.preventDefault();
    const sprintName = event.currentTarget.sprintName.value;
    const capacity = event.currentTarget.capacity.value;
    onSubmit(sprintName, capacity);
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
          <button className="btn btn-primary mr-2" type="submit">
            Add
          </button>
        </div>
        {/* <div className="flex flex-row">
          <input
            className=" placeholder-gray-500 mr-2"
            type="text"
            name="goal"
            placeholder="Goal"
          />
          <button className="btn btn-primary mr-2" type="submit">
            Add
          </button>
        </div> */}
      </form>
    </ActionZone>
  );
};

export default CreateSprintZoneForm;
