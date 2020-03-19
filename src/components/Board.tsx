import React, { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChevronLeft } from 'react-feather';
import config from 'utils/config';
import moment from 'moment';
import Loader from 'react-loader-spinner';

import * as boardActions from 'actions/boardActions';
import * as epicsActions from 'actions/epicsActions';
import { BoundActionsObjectMap } from 'actions/actionTypes';

import IStoreState, { IBoardState, IEpicsListState } from 'store/IStoreState';
import { SquareSpinner, Dialog } from 'styles/ThemeComponents';
import CreateSprintZoneForm from 'components/CreateSprintZoneForm';
import Sprint from 'components/Sprint';
import Epic from 'components/Epic';
import Story from 'components/Story';
import DependencyModeModal from 'components/DependencyModeModal';
import CreateEpicZoneForm from 'components/CreateEpicZoneForm';
import CreateStoryZoneForm from 'components/CreateStoryZoneForm';
import {
  countsPhrase,
  startCSVDownload,
  getStoriesCountMap,
  hasStories,
  getLoadMap,
} from 'utils/Helpers';
import { ISprint, IEpic } from 'types';

interface StateSelector {
  boardState?: IBoardState;
  epicsListState?: IEpicsListState;
}

function Board() {
  const state =
    useSelector<IStoreState, StateSelector>(state => ({
      boardState: state.boardState,
      epicsListState: state.epicsListState,
    })) || {};

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const { boardState, epicsListState } = state;
  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, BoundActionsObjectMap>(
    { ...boardActions, ...epicsActions },
    dispatch
  );
  const { boardId } = useParams();

  useEffect(() => {
    refreshEpicsList();
    refreshBoard();
    const interval = setInterval(() => {
      refreshEpicsList();
      refreshBoard();
      setLastRefresh(Date.now());
    }, config.BOARD_REFRESH_RATE_MS || 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshBoard = () => {
    if (!isNaN(parseInt(boardId))) {
      actions.fetchBoard(parseInt(boardId)).then(() => {
        setIsInitialLoad(false);
      });
    }
  };

  const refreshEpicsList = () => {
    if (!isNaN(parseInt(boardId))) {
      actions.fetchEpicsList(parseInt(boardId));
    }
  };

  const {
    data: board = {},
    isFetching,
    isSolving,
    isUploadingCsv,
    sprintAsyncCallStateById = {},
    storyAsyncCallStateById = {},
  } = boardState;
  const { name, id, sprints = [], unassigned = [] } = board;
  const storiesCountMap = getStoriesCountMap(sprints, unassigned);
  const hasStoriesAndSprints = hasStories(storiesCountMap) && sprints && sprints.length > 0;
  const loadMap = getLoadMap(sprints, unassigned);

  const handleCreateSprint = (sprint: ISprint) => {
    actions.createSprint(id, sprint);
  };

  const handleDeleteSprint = sprintId => {
    actions
      .deleteSprint(sprintId)
      .then(() => {
        toast.success('Sprint successfully deleted');
      })
      .catch(() => {
        toast.error('Error deleting sprint');
      });
  };

  const handleEditSprint = sprint => {
    actions.updateSprint(sprint).catch(() => {
      toast.error('Error updating sprint');
    });
  };

  const handleCreateEpic = (epicName, priority) => {
    actions.createEpic(id, epicName, priority);
  };

  const handleDeleteStory = (storyId, sprintId) => {
    actions
      .deleteStory(storyId, sprintId)
      .then(() => {
        toast.success('Story successfully deleted');
      })
      .catch(() => {
        toast.error('Error deleting story');
      });
  };

  const handleEditStory = story => {
    actions.updateStory(id, story).catch(() => {
      toast.error('Error updating story');
    });
  };

  const delayedHandleEditStory = _.debounce(story => handleEditStory(story), 1000);

  const handleCreateStory = (description, weight) => {
    // todo: hack to assign to the first epic in the list
    if (epics.length > 0) {
      actions.createStory(id, epics[0].id, description, weight);
    }
  };

  const handleSolve = () => {
    actions
      .solve(id)
      .then(() => {
        toast.success('Board stories successfully auto arranged');
      })
      .catch(() => {
        toast.error('Failed to auto arrange stories');
      });
  };

  const [dependencyMode, setDependencyMode] = useState(false);
  const [activeStory, setActiveStory] = useState<{
    id?: number;
    dependency?: string;
    weight?: number;
  }>({});

  const handleAddingDependency = story => {
    setDependencyMode(true);
    setActiveStory(story);
  };

  const handleDeleteDependency = (fromStoryId: number, toStoryId: number) => {
    actions.deleteDependency(id, fromStoryId, toStoryId).then(() => {
      toast.success('Dependency deleted successfully');
    });
  };

  const exitDependencyMode = () => {
    setDependencyMode(false);
    setActiveStory({});
  };

  const handleAddAsDependency = storyId => {
    const { id: activeStoryId } = activeStory;
    actions
      .addDependency(id, activeStoryId, storyId)
      .then(() => {
        toast.success('Dependency added successfully');
        exitDependencyMode();
      })
      .catch(() => {
        toast.error('Error adding dependency');
      });
  };

  const handleExportCsv = () => {
    actions
      .exportCsv(id)
      .then(res => {
        const { data } = res;
        const { text: csvText } = data;
        startCSVDownload(`board-${boardId}`, csvText);
      })
      .catch(() => {
        toast.error('Error downloading CSV');
      });
  };

  const {
    isFetchingEpicsList = false,
    data: epics = [],
    epicAsyncCallStateById = {},
  } = epicsListState;

  const uploadInputRef = useRef();

  const handleUploadClick = () => {
    if (uploadInputRef) {
      uploadInputRef.current.click();
    }
  };

  const handleFileChange = () => {
    const file = uploadInputRef.current.files[0];
    actions
      .uploadCsv(id, file)
      .then(res => {
        toast.success('CSV uploaded successfully');
        refreshEpicsList();
        refreshBoard();
      })
      .catch(() => {
        toast.error('Error uploading CSV');
      });
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [epicToDelete, setEpicToDelete] = useState<IEpic>({});
  const handleDeleteEpic = (epic: IEpic) => {
    setIsDeleteDialogOpen(true);
    setEpicToDelete(epic);
  };

  const handleConfirmEpicDelete = () => {
    const { id: epicId } = epicToDelete;
    actions
      .deleteEpic(epicId)
      .then(() => {
        toast.success('Epic successfully deleted');
      })
      .catch(() => {
        toast.error('Error deleting epic');
      });
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className={`flex-grow overflow-y-auto ${isUploadingCsv ? 'opacity-75' : ''}`}>
        {isFetching && isInitialLoad ? (
          <div className="flex items-stretch h-screen border-4 ">
            <div className="mx-auto w-1/12 self-center pb-16">
              <SquareSpinner className="mt-20" />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-row">
              <div className="flex flex-col lg:w-1/5 md:w-1 sm:w-1 pl-4 p-4 h-screen">
                <div className="flex-grow-0">
                  <div className="w-full mb-4 flex flex-row items-center">
                    <Link to="/boards" className="mb-2 flex flex-row items-center">
                      <ChevronLeft size="14" /> Boards
                    </Link>
                  </div>
                  <div className="w-full mb-4 text-2xl font-bold flex-shrink-0">{name}</div>
                  <div className="flex-grow-0">
                    <div className="text-xl mb-3">
                      Epics <span className="text-sm p-2">{countsPhrase('epic', epics)}</span>
                    </div>
                    <div className="mb-4">
                      <CreateEpicZoneForm onSubmit={handleCreateEpic} />
                    </div>
                  </div>
                </div>

                <div className="flex-grow flex flex-col overflow-scroll">
                  <div className="flex-grow">
                    {epics && epics.length > 0 ? (
                      epics.map((epic, i) => {
                        const { id: epicId } = epic;
                        const { [epicId]: epicCallState = {} } = epicAsyncCallStateById;
                        const { isLoading: isEpicLoading = false } = epicCallState;
                        return (
                          <Epic
                            {...epic}
                            key={i}
                            onDelete={handleDeleteEpic}
                            isLoading={isEpicLoading}
                          />
                        );
                      })
                    ) : (
                      <div className="italic text-gray-500">No epics found</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-row">
                <div className="w-3/4 h-screen flex flex-col bg-gray-100">
                  <div className="flex flex-grow-0 justify-between items-center mb-4 px-10 py-4">
                    <div className="mr-2 text-sm text-gray-600">
                      Last refreshed {moment(lastRefresh).fromNow(false)}
                    </div>
                    <div className="flex flex-row">
                      <input
                        type="file"
                        id="file"
                        className="hidden"
                        ref={uploadInputRef}
                        onChange={handleFileChange}
                      />
                      <button
                        name="button"
                        value="Upload"
                        className="btn btn-primary mr-2"
                        onClick={handleUploadClick}
                      >
                        {isUploadingCsv ? (
                          <Loader type="ThreeDots" color="#ffffff" width={20} height={20} />
                        ) : (
                          'Upload CSV'
                        )}
                      </button>{' '}
                      <button
                        className="btn btn-primary mr-2"
                        onClick={handleExportCsv}
                        disabled={!hasStoriesAndSprints}
                      >
                        Export CSV
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSolve}
                        disabled={!hasStoriesAndSprints}
                      >
                        Auto Arrange
                      </button>
                    </div>
                  </div>
                  <div className="flex-grow overflow-scroll px-10 pb-16">
                    <div className="flex flex-row items-center mb-3">
                      <div className="text-xl">Sprints</div>
                      <span className="text-sm p-2">{countsPhrase('sprint', sprints)}</span>
                    </div>
                    {isSolving || isUploadingCsv ? (
                      <SquareSpinner className="mt-20" />
                    ) : (
                      <div>
                        {sprints && sprints.length > 0 ? (
                          sprints.map((sprint, i) => {
                            const { id: sprintId, tickets, capacity } = sprint;
                            const { [sprintId]: sprintCallState = {} } = sprintAsyncCallStateById;
                            const { isLoading: isSprintLoading = false } = sprintCallState;
                            const load = loadMap[sprintId];
                            const loadLeft = capacity - load;
                            return (
                              <Sprint
                                key={i}
                                {...sprint}
                                onDelete={handleDeleteSprint}
                                onEdit={handleEditSprint}
                                isLoading={isSprintLoading}
                              >
                                <div className="flex flex-row justify-end mt-2 mb-2 text-sm ">
                                  <div className="flex flex-row bg-gray-200 p-1 rounded-md">
                                    <div className="mr-2">
                                      <div className="inline-block mr-1">Stories</div>
                                      <div className="rounded-md bg-gray-100 inline-block center px-2">
                                        {storiesCountMap[sprintId]}
                                      </div>
                                    </div>
                                    <div className="mr-2">
                                      <div className="inline-block mr-1">Current load</div>
                                      <div className="rounded-md bg-gray-100 inline-block center px-2">
                                        {load}
                                      </div>
                                    </div>
                                    <div className="mr-2">
                                      {loadLeft >= 0 && (
                                        <div className="inline-block mr-1">Load left</div>
                                      )}
                                      <div
                                        className={`rounded-md bg-gray-100 inline-block center px-2 ${
                                          loadLeft < 0 ? 'text-red-400' : ''
                                        }`}
                                      >
                                        {loadLeft >= 0
                                          ? loadLeft
                                          : `Load exceeds by ${Math.abs(loadLeft)}`}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap mx-auto">
                                  {tickets && tickets.length > 0 ? (
                                    tickets.map((story, i) => {
                                      const { id } = story;
                                      const { [id]: storyCallState = {} } = storyAsyncCallStateById;
                                      const { isLoading: isStoryLoading = false } = storyCallState;
                                      const { id: storyId } = activeStory;
                                      return (
                                        <Story
                                          key={i}
                                          {...story}
                                          onDelete={id => handleDeleteStory(id, sprintId)}
                                          onEdit={delayedHandleEditStory}
                                          isLoading={isStoryLoading}
                                          epics={epics}
                                          sprints={sprints}
                                          onAddingDependency={handleAddingDependency}
                                          dependencyMode={dependencyMode}
                                          isAddingDependency={id === storyId}
                                          onAddAsDependency={handleAddAsDependency}
                                          onDeleteDependency={handleDeleteDependency}
                                        />
                                      );
                                    })
                                  ) : (
                                    <div className="italic text-gray-500">
                                      No stories found in this sprint
                                    </div>
                                  )}
                                </div>
                              </Sprint>
                            );
                          })
                        ) : (
                          <div className="italic text-gray-500">No Sprints found</div>
                        )}
                        <div className="mt-4">
                          <CreateSprintZoneForm onSubmit={handleCreateSprint} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:w-1/4 md:w-1 sm:w-1 h-screen overflow-scroll px-10 pt-4 bg-gray-200 flex-grow ">
                  <div className=" flex flex-row items-center mb-3">
                    <div className="text-xl">Backlog</div>
                    <span className="text-sm p-2">{countsPhrase('story', unassigned)}</span>
                  </div>
                  {epics && epics.length > 0 ? (
                    <div>
                      <div className="mb-4">
                        <CreateStoryZoneForm onSubmit={handleCreateStory} epics={epics} />
                      </div>

                      <div className="">
                        {unassigned && unassigned.length > 0 ? (
                          unassigned.map((story, i) => {
                            const { id } = story;
                            const { [id]: storyCallState = {} } = storyAsyncCallStateById;
                            const { isLoading: isStoryLoading = false } = storyCallState;
                            const { id: storyId } = activeStory;

                            return (
                              <Story
                                key={i}
                                {...story}
                                onDelete={handleDeleteStory}
                                onEdit={delayedHandleEditStory}
                                isLoading={isStoryLoading}
                                epics={epics}
                                sprints={sprints}
                                onAddingDependency={handleAddingDependency}
                                onAddAsDependency={handleAddAsDependency}
                                onDeleteDependency={handleDeleteDependency}
                                dependencyMode={dependencyMode}
                                isAddingDependency={id === storyId}
                              />
                            );
                          })
                        ) : (
                          <div className="italic text-gray-500">No backlog stories found</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="italic text-gray-500">
                      Create an Epic first to create stories
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {dependencyMode && <DependencyModeModal story={activeStory} onCancel={exitDependencyMode} />}
      {dependencyMode}

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmEpicDelete}
        closeOnOutsideClick={true}
        className="w-1/3"
        intent="danger"
      >
        <div className="mb-3">
          You are deleting epic:{' '}
          <div className="flex flex-row items-center mt-4">
            <span className="tag mr-2">{epicToDelete.id}</span>
            <div className="text-lg">{epicToDelete.name}</div>
          </div>
        </div>

        <div>This will delete all stories under this epic. Are you sure you want to delete?</div>
      </Dialog>
    </div>
  );
}

export default Board;
