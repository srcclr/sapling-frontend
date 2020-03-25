import React, { useState } from 'react';
import { ActionZone } from 'styles/ThemeComponents';
import { IEpic } from 'types';

const CreateStoryZoneForm = ({
  onSubmit,
  epics = [],
}: {
  onSubmit: (description: string, weight: number, epicId: number) => void;
  epics: IEpic[];
}) => {
  const [a, setA] = useState(false);
  const handleSubmit = event => {
    event.preventDefault();
    const description = event.currentTarget.description.value;
    const weight = event.currentTarget.weight.value;
    const epicId = event.currentTarget.epic.value;
    onSubmit(description, weight, epicId);
    event.currentTarget.reset();
    setA(false);
  };

  return (
    <ActionZone actionName="Add Story" isActive={a} withHandle={false} minimal={true}>
      <form onSubmit={handleSubmit}>
        <div className="">
          <input
            className=" placeholder-gray-500 mr-2 mb-1 text-sm"
            type="text"
            name="description"
            placeholder="Description"
            autoFocus={a}
            required
          />
          <input
            className="placeholder-gray-500 mr-2 mb-1 text-sm"
            type="number"
            name="weight"
            placeholder="Weight"
          />{' '}
          <div className="relative">
            <select className="text-sm" name="epic">
              {epics &&
                epics.map((epic, i) => {
                  const { id, name } = epic;
                  return (
                    <option value={id} key={i}>
                      {name}
                    </option>
                  );
                })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-1">
          <button className="btn btn-primary mr-2 w-full text-sm" type="submit">
            Add
          </button>
        </div>
      </form>
    </ActionZone>
  );
};

export default CreateStoryZoneForm;
