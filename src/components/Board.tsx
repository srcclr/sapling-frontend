import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from 'react';
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
import * as boardListActions from 'actions/boardListActions';
import { BoundActionsObjectMap } from 'actions/actionTypes';

import IStoreState, { IBoardState, IEpicsListState, IBoardListState } from 'store/IStoreState';
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
import {
  ISprint,
  IEpic,
  IStoryRequest,
  ICrossBoardData,
  IStory,
  INotification,
  STORY_REQUEST_ACTION,
} from 'types';
import StoriesList from './StoriesList';
import EpicsList from './EpicsList';
import SprintStats from './SprintStats';

interface StateSelector {
  boardListState?: IBoardListState;
  boardState?: IBoardState;
  epicsListState?: IEpicsListState;
}

export const BoardContext = createContext(null);

function Board() {
  const state =
    useSelector<IStoreState, StateSelector>(state => ({
      boardListState: state.boardListState,
      boardState: state.boardState,
      epicsListState: state.epicsListState,
    })) || {};

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const { boardState, epicsListState, boardListState } = state;
  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, BoundActionsObjectMap>(
    { ...boardActions, ...epicsActions, ...boardListActions },
    dispatch
  );
  const { boardId } = useParams();

  useEffect(() => {
    refreshEpicsList();
    refreshBoard();
    refreshBoardList();
    const interval = setInterval(() => {
      refreshEpicsList();
      refreshBoard();
      setLastRefresh(Date.now());
    }, config.BOARD_REFRESH_RATE_MS || 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshBoard = () => {
    if (!isNaN(parseInt(boardId))) {
      actions
        .fetchBoard(parseInt(boardId))
        .then(() => {
          setIsInitialLoad(false);
        })
        .catch(() => {
          setIsInitialLoad(false);
          toast.error('Error loading board');
        });
    }
  };

  const refreshBoardList = () => {
    actions.fetchBoardList();
  };

  const refreshEpicsList = () => {
    if (!isNaN(parseInt(boardId))) {
      actions.fetchEpicsList(parseInt(boardId));
    }
  };

  const { data: boardList = [] } = boardListState;

  const {
    data: board = {},
    isFetching,
    isSolving,
    isUploadingCsv,
    sprintAsyncCallStateById = {},
    storyAsyncCallStateById = {},
  } = boardState;
  const { name, id, sprints = [], unassigned = [], notifications = [] } = board;
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
    dependencies?: string;
    weight?: number;
  }>({});

  const handleAddingDependency = useCallback(story => {
    setDependencyMode(true);
    setActiveStory(story);
  }, []);

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
    const { id: activeStoryId, dependencies: existingDependencies = [] } = activeStory;

    if (!existingDependencies.includes(storyId)) {
      actions
        .addDependency(id, activeStoryId, storyId)
        .then(() => {
          toast.success('Dependency added successfully');
          exitDependencyMode();
        })
        .catch(() => {
          toast.error('Error adding dependency');
        });
    } else {
      toast.error('Dependency already exists');
    }
  };

  const [crossBoardData, setCrossBoardData] = useState<ICrossBoardData>({});
  const [isFetchingCrossBoardData, setIsFetchingCrossBoardData] = useState(false);

  const handleDependencyBoardSelect = (boardId: number) => {
    if (!boardId) {
      setCrossBoardData({});
      return;
    }
    setIsFetchingCrossBoardData(true);
    actions.fetchBoardDetails(boardId).then(res => {
      const { data: boardDetails } = res;
      actions.fetchEpicsListByBoardId(boardId).then(res => {
        const { data: epics } = res;

        const sprintPreviews = boardDetails.sprints.map(sprint => ({
          id: sprint.id,
          name: sprint.name,
        }));
        const epicPreviews = epics.map(epic => ({
          id: epic.id,
          name: epic.name,
        }));
        setCrossBoardData({
          sprints: sprintPreviews,
          epics: epicPreviews,
          boardId: boardId,
        });
        setIsFetchingCrossBoardData(false);
      });
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

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [requestToWithdraw, setRequestToWithdraw] = useState<IStoryRequest>({});
  const handleWithdrawRequest = request => {
    setIsWithdrawDialogOpen(true);
    setRequestToWithdraw(request);
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

  const handleConfirmRequestWithdraw = () => {
    actions
      .withdrawStoryRequest(id, requestToWithdraw)
      .then(() => {
        toast.success('Story request withdrawn successfully');
        setIsWithdrawDialogOpen(false);
      })
      .catch(() => {
        toast.error('Error withdrawing story request.');
      });
  };

  const handleSubmitStoryRequest = (storyRequest: IStoryRequest) => {
    actions
      .createStoryRequest(id, storyRequest)
      .then(res => {
        toast.success('Story request created successfully');
      })
      .catch(() => {
        toast.error('Error creating story request');
      });
  };

  const handleAcceptOrRejectStoryRequest = (
    requestId: number,
    action: STORY_REQUEST_ACTION.Accept | STORY_REQUEST_ACTION.Reject
  ) => {
    actions
      .acceptOrRejectStoryRequest(id, requestId, action)
      .then(res => {
        toast.success('Success');
      })
      .catch(() => {
        toast.error('Error');
      });
  };

  const boardApi = useMemo(
    () => ({
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
    }),
    [dependencyMode, epics, sprints, crossBoardData, isFetchingCrossBoardData]
  );

  const { id: activeStoryId } = activeStory;

  const [isNotificationsActive, setIsNotificationsActive] = useState(false);

  return (
    <BoardContext.Provider value={boardApi}>
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
                <div className="flex flex-col lg:w-1/5 md:w-1 sm:w-1  h-screen">
                  <div className="flex-grow-0 px-4 pt-4">
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

                  <div
                    className={`${
                      !isNotificationsActive ? 'flex-grow' : 'flex-grow-0 h-40'
                    } flex flex-col overflow-scroll`}
                  >
                    <div className="px-4">
                      <EpicsList
                        epics={epics}
                        epicAsyncCallStateById={epicAsyncCallStateById}
                        handleDeleteEpic={handleDeleteEpic}
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      !isNotificationsActive ? 'flex-grow-0 h-16' : 'flex-grow h-64'
                    } bg-teal-800 notifications text-white flex flex-col`}
                  >
                    <div
                      className="tab flex justify-end items-center relative text-sm border-t-2 border-gray-300 p-4 "
                      onClick={() => setIsNotificationsActive(!isNotificationsActive)}
                    >
                      <div className="mr-2">Notifications </div>
                      {notifications && notifications.length > 0 ? (
                        <div className=" text-xs px-2 py-1 bg-red-600 text-white center rounded-full">
                          {notifications.length}
                        </div>
                      ) : (
                        <div className="text-xs px-2 py-1 bg-gray-600 text-white center rounded-full">
                          0
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-grow overflow-scroll">
                      {notifications && notifications.length > 0 ? (
                        notifications.map((notification: INotification, i) => {
                          const {
                            storyRequestId,
                            epic,
                            sender: senderBoard,
                            notes,
                            points,
                            description,
                            sprint,
                          } = notification;
                          return (
                            <div
                              key={i}
                              className="border-b-2 border-dotted border-teal-700 pb-4 mb-4"
                            >
                              <div className="text-sm">
                                <span className="font-black">{senderBoard}</span> has requested to
                                add a story "<span className="font-black">{description}</span>" to
                                this board in sprint <span className="font-black">{sprint}</span>,
                                epic <span className="font-black">{epic}</span>
                              </div>{' '}
                              {notes && (
                                <div className="border-l-2 border-teal-500 pl-2 text-sm mt-2">
                                  Notes:
                                  <div>{notes}</div>
                                </div>
                              )}
                              <div className="flex flex-row mt-2">
                                <button
                                  className="btn btn-minimal w-1/2 mr-2"
                                  onClick={() =>
                                    handleAcceptOrRejectStoryRequest(
                                      storyRequestId,
                                      STORY_REQUEST_ACTION.Reject
                                    )
                                  }
                                >
                                  Reject
                                </button>
                                <button
                                  className="btn btn-primary w-1/2"
                                  onClick={() =>
                                    handleAcceptOrRejectStoryRequest(
                                      storyRequestId,
                                      STORY_REQUEST_ACTION.Accept
                                    )
                                  }
                                >
                                  Accept
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="italic text-teal-600 text-sm">No new notifications</div>
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
                                  <SprintStats
                                    storiesCount={storiesCountMap[sprintId]}
                                    currentLoadCount={load}
                                    loadLeftCount={loadLeft}
                                  />
                                  <StoriesList
                                    sprintId={sprintId}
                                    stories={tickets}
                                    activeStoryId={activeStoryId}
                                    storyAsyncCallStateById={storyAsyncCallStateById}
                                    emptyListMessage="No stories found in this sprint"
                                  />
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
                        <StoriesList
                          stories={unassigned}
                          activeStoryId={activeStoryId}
                          storyAsyncCallStateById={storyAsyncCallStateById}
                          emptyListMessage="No backlog stories found"
                        />
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
        {dependencyMode && (
          <DependencyModeModal story={activeStory} onCancel={exitDependencyMode} />
        )}
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
        <Dialog
          open={isWithdrawDialogOpen}
          onClose={() => setIsWithdrawDialogOpen(false)}
          onConfirm={handleConfirmRequestWithdraw}
          closeOnOutsideClick={true}
          className="w-1/3"
          intent="danger"
        >
          <div className="mb-3">
            You are withdrawing request for this story:
            <div className="flex flex-col items-center mt-4">
              <div className="mb-2">{requestToWithdraw.storyDescription}</div>
              <div>
                <input
                  className=""
                  type="text"
                  name="notes"
                  placeholder="notes"
                  onChange={e =>
                    setRequestToWithdraw({ ...requestToWithdraw, notes: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>Withdraw?</div>
        </Dialog>
      </div>
    </BoardContext.Provider>
  );
}

export default Board;
