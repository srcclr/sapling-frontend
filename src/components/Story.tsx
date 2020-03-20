import React, { useRef, useState } from 'react';
import _ from 'lodash';
import { IStory, IEpic, ISprint } from 'types';
import { Trash, X } from 'react-feather';
import Loader from 'react-loader-spinner';
import { useForm } from 'react-hook-form';
import { useOnClickOutside } from 'hooks';
import { getNumberValue } from 'utils/Helpers';
import classnames from 'classnames';

interface IStoryProps {
  onDelete: (epicId: number) => void;
  onEdit: (story: IStory) => void;
  isLoading: boolean;
  epics: IEpic[];
  sprints: ISprint[];
  onAddingDependency: (story: IStory) => void;
  onDeleteDependency: (from: number, to: number) => void;
  isAddingDependency: boolean;
  onAddAsDependency: (storyId: number) => void;
  dependencyMode: boolean;
}

const Story: React.FunctionComponent<IStory & IStoryProps> = ({
  id,
  dependencies,
  description,
  epic,
  home,
  pin,
  weight,
  onDelete,
  onEdit,
  onAddingDependency,
  isAddingDependency,
  onAddAsDependency,
  onDeleteDependency,
  isLoading,
  epics,
  sprints,
  dependencyMode,
}) => {
  const [isActive, setIsActive] = useState(false);

  // For detecting outside clicks
  const ref = useRef();
  useOnClickOutside(ref, () => {
    setIsActive(false);
  });

  const pinValue = getNumberValue(pin);
  const epicValue = getNumberValue(epic);

  const handleFormSubmit = values => {
    event.preventDefault();
    onEdit({
      id,
      ...values,
    });
  };

  const handleAddingDependency = () => {
    onAddingDependency({ id, description, weight, epic: epicValue, dependencies });
    setIsActive(false);
  };

  const handleAddAsDependency = () => {
    onAddAsDependency(id);
  };

  const activeEpic = epics && epics.find(e => e.id === epicValue);
  const { name: epicName } = activeEpic || {};

  const activePin = sprints && sprints.find(sprint => sprint.id === pinValue);
  const { name: sprintName } = activePin || {};

  const isDependencyCandidate = dependencyMode && !isAddingDependency;

  const defaultValues = {
    description,
    weight,
    epic,
    pin,
    epicName,
    sprintName,
  };

  const { handleSubmit, register, reset } = useForm({
    defaultValues,
  });

  const handleDelete = () => {
    onDelete(id);
    reset(defaultValues);
  };

  const toggleActive = () => {
    setIsActive(!isActive);
    reset(defaultValues);
  };

  const storyClassNames = classnames({
    active: isActive,
    'border-2 border-teal-200': isAddingDependency,
    'cursor-pointer hover:shadow-lg': isDependencyCandidate,
  });

  const detailsClassNames = classnames({
    'active shadow-lg': isActive,
    'cursor-pointer': !isActive,
  });

  return (
    <div
      className={`story ${storyClassNames}`}
      ref={ref}
      onClick={isDependencyCandidate ? handleAddAsDependency : null}
    >
      <div className={`flex flex-col details ${detailsClassNames}`}>
        <div
          className={`flex-grow p-4  flex overflow-hidden flex-row items-start justify-between  `}
          onClick={!isDependencyCandidate ? () => setIsActive(true) : null}
        >
          <div>
            {!isActive ? (
              <div className="flex-grow ">
                <DetailsView
                  description={defaultValues.description}
                  id={id}
                  weight={defaultValues.weight}
                  epicName={defaultValues.epicName}
                  sprintName={defaultValues.sprintName}
                  onClick={toggleActive}
                />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                onChange={handleSubmit(handleFormSubmit)}
                className={`flex-grow ${isLoading ? 'opacity-50' : ''}`}
              >
                <div className="flex lg:flex-col md:flex-col sm:flex-col mb-2 ">
                  <textarea
                    className="mb-2 border-b-2 border-dotted border-gray-200 placeholder-gray-500 w-full minimal text-sm font-semibold"
                    type="text"
                    rows={3}
                    name="description"
                    placeholder="Story"
                    ref={register({ required: true })}
                  />
                  <div className="flex flex-row items-center w-full text-xs">
                    <div className="mr-1">Story Points</div>
                    <input
                      className="w-full mb-2 placeholder-gray-500 w-full minimal"
                      type="number"
                      name="weight"
                      placeholder="Capacity (eg. 10)"
                      ref={register}
                    />
                  </div>
                  <div className="flex flex-row items-center w-full text-xs">
                    <div className="mr-1">Epic</div>
                    <select
                      className="w-full rounded-sm bg-transparent p-1"
                      name="epic"
                      ref={register}
                    >
                      {epics &&
                        epics.map((epic, i) => {
                          const { id, name } = epic;
                          return (
                            <option key={i} value={id}>
                              {name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className="flex flex-row items-center w-full text-xs">
                    <div className="mr-1 w-1/5">Pin to</div>
                    <select
                      className="w-full rounded-sm bg-transparent p-1"
                      name="pin"
                      ref={register}
                    >
                      <option value="">None</option>
                      {sprints &&
                        sprints.map((sprint, i) => {
                          const { id, name } = sprint;
                          return (
                            <option key={i} value={id}>
                              {name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="flex flex-col justify-center px-1 flex-grow-0">
            <div>
              <div className="tag rounded-lg text-center">{id}</div>
            </div>
            <div className=" h-6 w-6 flex flex-row items-center justify-center">
              {isLoading ? (
                <Loader type="Grid" width={13} height={13} />
              ) : (
                <Trash size="16" className="clickable" onClick={handleDelete} />
              )}
            </div>
          </div>
        </div>
        <div className="flex-grow-0 mt-1 px-4 py-2 bg-gray-200">
          {dependencies && dependencies.length > 0 ? (
            dependencies.map((dep, i) => {
              return (
                <div key={i} className="bg-gray-100 text-xs p-1 rounded-md mr-1 inline-block ">
                  <div className="flex flex-row items-center">
                    {dep}{' '}
                    <X
                      size="16"
                      className="clickable text-red-500"
                      onClick={() => onDeleteDependency(id, dep)}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <span className="text-sm italic text-gray-400">No dependencies</span>
          )}
          <a className="cursor-pointer text-sm ml-1" onClick={handleAddingDependency}>
            Add
          </a>
        </div>
      </div>
    </div>
  );
};

const DetailsView = ({ id, description, weight, epicName, sprintName, onClick }) => {
  return (
    <div className="w-full flex cursor-pointer bg-white" onClick={onClick}>
      <div className="flex-grow">
        <div className="text-sm font-semibold mb-2">{description} </div>
        <div className="text-sm ">Story Points: {weight} </div>
        <div className="text-sm ">Epic: {epicName} </div>
        {sprintName && <div className="text-sm ">Pin: {sprintName} </div>}
      </div>
    </div>
  );
};

export default Story;
