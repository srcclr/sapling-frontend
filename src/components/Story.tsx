import React, { useRef, useState, useContext } from 'react';
import _ from 'lodash';
import { IStory, STORY_REQUEST_ACTION, IStoryRequestWithViewData } from 'types';
import { Trash, X, MoreVertical } from 'react-feather';
import Loader from 'react-loader-spinner';
import { useForm } from 'react-hook-form';
import { useOnClickOutside } from 'hooks';
import { getNumberValue } from 'utils/Helpers';
import classnames from 'classnames';
import CrossBoardDependencies from './CrossBoardDependencies';
import CrossBoardDependenciesList from './CrossBoardDependenciesList';
import { BoardContext } from './Board';

interface IStoryProps {
  isLoading: boolean;
  sprintId?: number;
  isAddingDependency: boolean;
}

const Story: React.FunctionComponent<IStory & IStoryProps> = ({
  id,
  dependencies,
  crossBoardDependencies,
  description,
  sprintId,
  epic,
  home,
  pin,
  weight,
  isAddingDependency,
  isLoading,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDependenciesViewActive, setIsDependenciesViewActive] = useState(false);

  const board = useContext(BoardContext);

  const {
    delayedHandleEditStory,
    handleAddingDependency,
    handleAddAsDependency,
    handleDeleteDependency,
    dependencyMode,
    handleDependencyBoardSelect,
    handleSubmitStoryRequest,
    handleDeleteStory,
    handleWithdrawRequest,
    isFetchingCrossBoardData,
    crossBoardData,
    boardList,
    epics,
    sprints,
  } = board;

  // For detecting outside clicks
  const ref = useRef();
  useOnClickOutside(ref, () => {
    setIsActive(false);
    setIsDependenciesViewActive(false);
  });

  const pinValue = getNumberValue(pin);
  const epicValue = getNumberValue(epic);

  const handleFormSubmit = values => {
    event.preventDefault();
    delayedHandleEditStory({
      id,
      ...values,
    });
  };

  console.log(crossBoardData);

  const handleStoryRequestAction = (
    requestAction: STORY_REQUEST_ACTION,
    storyRequestData: IStoryRequestWithViewData
  ) => {
    console.log(storyRequestData);
    switch (requestAction) {
      case STORY_REQUEST_ACTION.Withdraw: {
        return handleWithdrawRequest(storyRequestData);
      }
      case STORY_REQUEST_ACTION.Resubmit: {
        const requestData = {
          ...storyRequestData,
          storyId: id,
        };

        delete requestData.id;
        delete requestData.state;
        return handleSubmitStoryRequest(requestData);
      }
    }
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
    handleDeleteStory(id, sprintId);
    reset(defaultValues);
  };

  const toggleActive = () => {
    setIsActive(!isActive);
    reset(defaultValues);
  };

  const storyClassNames = classnames({
    active: isActive || isDependenciesViewActive,
    'border-2 border-teal-200': isAddingDependency,
    'cursor-pointer hover:shadow-lg': isDependencyCandidate,
  });

  const detailsClassNames = classnames({
    'active shadow-lg': isActive,
  });

  const dependenciesClassName = classnames({
    'active shadow-lg ': isDependenciesViewActive,
  });

  return (
    <div
      className={`story ${storyClassNames}`}
      ref={ref}
      onClick={isDependencyCandidate ? () => handleAddAsDependency(id) : null}
    >
      <div className={`flex flex-col details ${detailsClassNames}`}>
        <div
          className={`flex-grow p-4 flex overflow-hidden flex-row items-start justify-between  `}
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
                  onClick={!isDependencyCandidate ? toggleActive : null}
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
        <div className="relative flex-grow-0 mt-1 bg-gray-200 h-10">
          <div
            className={`dependencies w-full flex flex-row items-start justify-between bg-gray-200 ${dependenciesClassName}`}
          >
            <div className={`px-4 py-2 w-full`}>
              <div>
                {dependencies && dependencies.length > 0 ? (
                  dependencies.map((dep, i) => {
                    return (
                      <div
                        key={i}
                        className="bg-gray-100 text-xs p-1 rounded-md mr-1 inline-block "
                      >
                        <div className="flex flex-row items-center">
                          {dep}{' '}
                          <X
                            size="16"
                            className="clickable text-red-500"
                            onClick={() => handleDeleteDependency(id, dep)}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm italic text-gray-400">No dependencies</span>
                )}
                <a
                  className="cursor-pointer text-sm ml-1"
                  onClick={() => {
                    handleAddingDependency({
                      id,
                      description,
                      weight,
                      epic: epicValue,
                      dependencies,
                    });
                    setIsActive(false);
                    setIsDependenciesViewActive(false);
                  }}
                >
                  Add
                </a>
              </div>

              <div className="mt-2 text-xs cross">
                <div className="font-semibold mb-2">Cross Board Dependencies</div>
                <CrossBoardDependencies
                  boardList={boardList}
                  onBoardSelect={handleDependencyBoardSelect}
                  data={crossBoardData}
                  isFetching={isFetchingCrossBoardData}
                  onSubmitRequest={values => {
                    handleSubmitStoryRequest({
                      ...values,
                      storyPoints: weight,
                      storyDescription: description,
                      storyId: id,
                    });
                  }}
                />
                <CrossBoardDependenciesList
                  boardList={boardList}
                  dependencies={crossBoardDependencies}
                  onActionClick={handleStoryRequestAction}
                />
              </div>
            </div>
            <div className="py-2 pr-2">
              <MoreVertical
                size={20}
                className="text-teal-900 cursor-pointer hover:text-teal-600"
                onClick={() => setIsDependenciesViewActive(true)}
              />
            </div>
          </div>
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
        <div className="text-xs ">Story Points: {weight} </div>
        <div className="text-xs ">Epic: {epicName} </div>
        {sprintName && <div className="text-xs ">Pin: {sprintName} </div>}
      </div>
    </div>
  );
};

export default Story;
