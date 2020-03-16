import React, { useState } from 'react';
import { ActionZone } from 'styles/ThemeComponents';

const CreateEpicZoneForm = ({
  onSubmit,
}: {
  onSubmit: (epicName: string, priority: number) => void;
}) => {
  const [a, setA] = useState(false);
  const handleSubmit = event => {
    event.preventDefault();
    const epicName = event.currentTarget.epicName.value;
    const priority = event.currentTarget.priority.value;
    onSubmit(epicName, priority);
    event.currentTarget.reset();
    setA(false);
  };

  return (
    <ActionZone actionName="Add Sprint" isActive={a} withHandle={false} minimal={true}>
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            className=" placeholder-gray-500 mr-2 mb-1"
            type="text"
            name="epicName"
            placeholder="New epic name"
            autoFocus={a}
            required
          />
          <input
            className=" placeholder-gray-500 mr-2 mb-1"
            type="number"
            name="priority"
            placeholder="Priority"
          />{' '}
          <button className="btn btn-primary mr-2 w-full" type="submit">
            Add
          </button>
        </div>
      </form>
    </ActionZone>
  );
};

export default CreateEpicZoneForm;
