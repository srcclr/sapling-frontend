import React, { useRef, useState } from 'react';
import _ from 'lodash';
import { IStory, IEpic, ISprint } from 'types';
import { Trash, X } from 'react-feather';
import Loader from 'react-loader-spinner';
import { useForm } from 'react-hook-form';
import { useOnClickOutside } from 'hooks';
import { getNumberValue } from 'utils/Helpers';

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
  const [isEditMode, setIsEditMode] = useState(false);

  // For detecting outside clicks
  const ref = useRef();
  useOnClickOutside(ref, () => {
    setIsEditMode(false);
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
    onAddingDependency({ id, description, weight, epic: epicValue });
  };

  const handleAddAsDependency = () => {
    onAddAsDependency(id);
  };

  const handleDelete = () => {
    onDelete(id);
    toggleEditMode();
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

  const toggleEditMode = () => {
    reset(defaultValues);
    setIsEditMode(!isEditMode);
  };

  return (
    <div className={`story overflow-hidden `} ref={ref}>
      {isDependencyCandidate ? (
        <DependencyCandidateView
          description={description}
          id={id}
          weight={weight}
          epicName={epicName}
          onClick={handleAddAsDependency}
        />
      ) : (
        <div
          className={`inner flex flex-row items-start justify-between shadow-lg overflow-scroll ${
            isAddingDependency ? 'border-2 border-teal-200' : ''
          }`}
        >
          <div>
            {!isEditMode ? (
              <div className="flex-grow cursor-pointer">
                <DetailsView
                  description={defaultValues.description}
                  id={id}
                  weight={defaultValues.weight}
                  epicName={defaultValues.epicName}
                  sprintName={defaultValues.sprintName}
                  onClick={toggleEditMode}
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

            <div className="mt-1">
              <div className="text-sm">Dependencies</div>
              {dependencies && dependencies.length > 0 ? (
                dependencies.map((dep, i) => {
                  return (
                    <div key={i} className="tag mr-1 inline-block ">
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

          <div className="flex flex-col justify-center px-1 flex-grow-0">
            <div>
              <div className="tag rounded-lg">{id}</div>
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
      )}
    </div>
  );
};

const DependencyCandidateView = ({ id, description, weight, epicName, onClick }) => {
  return (
    <div className="inner-plain flex p-3 hover:shadow-lg cursor-pointer bg-white" onClick={onClick}>
      <div className="flex-grow opacity-75">
        <div className="text-sm font-semibold mb-1">{description} </div>
        <div className="text-sm ">Story Points: {weight} </div>
        <div className="text-sm ">Epic: {epicName} </div>
      </div>
      <div>
        <div className="tag rounded-lg">{id}</div>
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
