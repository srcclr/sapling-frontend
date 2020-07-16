import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import hash from 'object-hash';

import _ from 'lodash';
import { toast } from 'react-toastify';
import { ArcherContainer } from 'react-archer';

import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChevronLeft, X, ChevronRight } from 'react-feather';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import config from 'utils/config';

import * as boardActions from 'actions/boardActions';
import * as epicsActions from 'actions/epicsActions';
import * as boardListActions from 'actions/boardListActions';
import { BoundActionsObjectMap } from 'actions/actionTypes';

import AuthService from 'utils/AuthService';

import IStoreState, {
  IBoardState,
  IEpicsListState,
  IBoardListState,
  IMyState,
} from 'store/IStoreState';
import { SquareSpinner, Dialog } from 'styles/ThemeComponents';
import CreateSprintZoneForm from 'components/CreateSprintZoneForm';
import Sprint from 'components/Sprint';
import DependencyModeModal from 'components/DependencyModeModal';
import CreateEpicZoneForm from 'components/CreateEpicZoneForm';
import CreateStoryZoneForm from 'components/CreateStoryZoneForm';
import {
  countsPhrase,
  startCSVDownload,
  getStoriesCountMap,
  hasStories,
  getLoadMap,
  getStatsMap,
} from 'utils/Helpers';
import {
  ISprint,
  IEpic,
  IStoryRequest,
  ICrossBoardData,
  IStory,
  STORY_REQUEST_ACTION,
  NAVIGATION_LINKS,
} from 'types';
import StoriesList from './StoriesList';
import EpicsList from './EpicsList';
import SprintStats from './SprintStats';
import NotificationsList from './NotificationsList';
import SideNavigation from './SideNavigation';
import { useMultipleRects } from 'use-multiple-rects';

interface StateSelector {
  boardListState?: IBoardListState;
  boardState?: IBoardState;
  epicsListState?: IEpicsListState;
  myState?: IMyState;
}

export const BoardContext = createContext(null);

function Board() {
  const state =
    useSelector<IStoreState, StateSelector>(state => ({
      boardListState: state.boardListState,
      boardState: state.boardState,
      epicsListState: state.epicsListState,
      myState: state.myState,
    })) || {};

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const { boardState, epicsListState, boardListState, myState } = state;

  const { firstName } = myState;

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
  const { storiesCountMap, loadMap, sprintStoryIds = [] } = getStatsMap(sprints, unassigned);
  const hasStoriesAndSprints = hasStories(storiesCountMap) && sprints && sprints.length > 0;

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

  const handleCreateEpic = (epicName = '', priority: number) => {
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

  const handleEditStory = (story: IStory) => {
    actions.updateStory(id, story).catch(() => {
      toast.error('Error updating story');
    });
  };

  const delayedHandleEditStory = _.debounce(story => handleEditStory(story), 1000);

  const handleCreateStory = (description = '', weight: number, epicId: number) => {
    actions.createStory(id, epicId, description, weight);
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
    setActiveDepArrowsStory(story.id);
  }, []);

  const [activeDepArrowsStory, setActiveDepArrowsStory] = useState('');
  const handleShowDependencyArrows = useCallback(storyId => {
    setActiveDepArrowsStory(storyId);
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
    action: STORY_REQUEST_ACTION.Accept | STORY_REQUEST_ACTION.Reject,
    notes: string
  ) => {
    actions
      .acceptOrRejectStoryRequest(id, requestId, action, notes)
      .then(res => {
        toast.success('Success');
      })
      .catch(() => {
        toast.error('Error');
      });
  };

  const handleAcknowledgeNotification = (
    notificationId: number,
  ) => {
    actions
      .acknowledgeNotification(id, notificationId)
      .then(res => {
        toast.success('Success');
      })
      .catch(() => {
        toast.error('Error');
      });
  };

  const { id: activeStoryId } = activeStory;

  const [activeNavigationTab, setActiveNavigationTab] = useState(NAVIGATION_LINKS.EPICS);

  const handleSetActiveNavigationTab = tab => {
    if (activeNavigationTab === tab) {
      setActiveNavigationTab('');
    } else {
      setActiveNavigationTab(tab);
    }
  };

  const [expandSection, setExpandSection] = useState('');

  const handleLogout = () => {
    AuthService.logout().then(() => {
      window.location = '/login' as any;
    });
  };

  const [storyRefs, storyRects] = useMultipleRects({ ids: sprintStoryIds });
  const currentBoardId = id;
  const boardApi = useMemo(
    () => ({
      currentBoardId,
      delayedHandleEditStory,
      handleAddingDependency,
      handleShowDependencyArrows,
      handleAddAsDependency,
      handleDeleteDependency,
      dependencyMode,
      handleDependencyBoardSelect,
      handleSubmitStoryRequest,
      handleDeleteStory,
      handleWithdrawRequest,
      isFetchingCrossBoardData,
      activeDepArrowsStory,
      crossBoardData,
      boardList,
      epics,
      sprints,
      storyRefs,
      storyRects,
    }),
    [
      dependencyMode,
      epics,
      sprints,
      crossBoardData,
      isFetchingCrossBoardData,
      storyRefs,
      storyRects,
      activeDepArrowsStory,
    ]
  );

  return (
    <BoardContext.Provider value={boardApi}>
      <div className="w-full ">
        <div className={`flex-grow overflow-y-auto ${isUploadingCsv ? 'opacity-75' : ''}`}>
          {isFetching && isInitialLoad ? (
            <div className="flex items-stretch h-screen border-4 ">
              <div className="mx-auto w-1/12 self-center pb-16">
                <SquareSpinner className="mt-20" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-screen">
              {/* Header */}
              <div className="flex flex-grow-0 justify-between items-center px-4 py-4 bg-gray-100 border-b-4 border-white">
                <div className="flex flex-row items-center">
                  <Link to="/boards" className="flex flex-row items-center mr-4 pr-4 border-r ">
                    <ChevronLeft size="14" /> Boards
                  </Link>
                  <div className="text-1xl font-bold">{name}</div>
                </div>

                <div className="flex flex-row items-center">
                  <div className="mr-2 text-sm text-gray-600 mr-4 pr-4 border-r">
                    Last refreshed {moment(lastRefresh).fromNow(false)}
                  </div>
                  <div className="flex flex-row mr-2 mr-4 pr-4 border-r">
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
                      className="btn btn-primary mr-2 text-sm"
                      onClick={handleUploadClick}
                    >
                      {isUploadingCsv ? (
                        <Loader type="ThreeDots" color="#ffffff" width={20} height={20} />
                      ) : (
                        'Upload CSV'
                      )}
                    </button>{' '}
                    <button
                      className="btn btn-primary mr-2 text-sm"
                      onClick={handleExportCsv}
                      disabled={!hasStoriesAndSprints}
                    >
                      Export CSV
                    </button>
                    <button
                      className="btn btn-primary text-sm"
                      onClick={handleSolve}
                      disabled={!hasStoriesAndSprints}
                    >
                      Auto Arrange
                    </button>
                  </div>
                  <div className="flex justify-end items-center">
                    <div className="mr-2">{firstName}</div>{' '}
                    <button className="btn btn-minimal text-xs" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
              {/* End Header */}

              {/* Body */}

              <div className="flex flex-row flex-grow overflow-scroll">
                <SideNavigation
                  active={activeNavigationTab}
                  data={{ notificationsCount: notifications.length || 0 }}
                  onChange={handleSetActiveNavigationTab}
                />
                {activeNavigationTab && (
                  <div className={`flex flex-col  lg:w-1/5 md:w-1 sm:w-1 overflow-scroll relative`}>
                    <div className="absolute p-2 top-0 right-0">
                      <X
                        size={20}
                        className="mx-auto clickable"
                        onClick={() => setActiveNavigationTab('')}
                      />
                    </div>
                    {activeNavigationTab === NAVIGATION_LINKS.EPICS && (
                      <div className="px-4 pt-4 flex flex-col overflow-hidden">
                        <div className="text-xl mb-3 flex-grow-0">
                          <span className="text-xl mb-3">Epics</span>{' '}
                          <span className="text-sm p-2">{countsPhrase('epic', epics)}</span>
                        </div>

                        <div className="px-4 flex-grow overflow-scroll">
                          <div className="mt-4 mb-4">
                            <CreateEpicZoneForm onSubmit={handleCreateEpic} />
                          </div>
                          <EpicsList
                            epics={epics}
                            epicAsyncCallStateById={epicAsyncCallStateById}
                            handleDeleteEpic={handleDeleteEpic}
                          />
                        </div>
                      </div>
                    )}
                    {activeNavigationTab === NAVIGATION_LINKS.NOTIFICATIONS && (
                      <div className="px-4 pt-4 flex flex-col overflow-hidden">
                        <div className="text-xl mb-3 flex-grow-0">
                          Notifications{' '}
                          <span className="text-sm p-2">
                            {countsPhrase('notification', notifications)}
                          </span>
                        </div>
                        <div className="flex-grow overflow-scroll">
                          <div className="px-4 ">
                            <NotificationsList
                              notifications={notifications}
                              onAcceptOrRejectStoryRequest={handleAcceptOrRejectStoryRequest}
                              onAcknowledgeNotification={handleAcknowledgeNotification}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {activeNavigationTab === NAVIGATION_LINKS.USERS && (
                      <div className="px-4 pt-4">
                        <div className="text-xl mb-3">Users </div>
                        <div className="px-4">
                          <div className="italic text-gray-500">Coming soon</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`flex flex-row bg-gray-100 ${
                    activeNavigationTab ? 'w-4/5' : 'w-full'
                  }`}
                >
                  <div
                    className={`${
                      expandSection === 'BACKLOG' ? 'hidden' : 'visible'
                    } flex-grow px-10 py-4 w-3/4 overflow-scroll flex flex-col bg-gray-100`}
                  >
                    <div className="flex flex-row items-center mb-3">
                      <div className="text-xl">Sprints</div>
                      <span className="text-sm p-2">{countsPhrase('sprint', sprints)}</span>
                    </div>
                    {isSolving || isUploadingCsv ? (
                      <SquareSpinner className="mt-20" />
                    ) : (
                      <ArcherContainer
                        strokeColor="red"
                        className={`arrows-container ${!activeDepArrowsStory ? 'inactive' : ''}  `}
                        strokeWidth={2}
                        arrowLength={5}
                        strokeDasharray="3"
                      >
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
                      </ArcherContainer>
                    )}
                  </div>
                  <div
                    className={`${
                      expandSection === 'BACKLOG' ? 'w-full flex-grow' : 'w-1/4 flex-grow-0'
                    }  overflow-scroll bg-gray-100 flex items-stretch `}
                  >
                    <div className="relative bg-gray-200 pl-6  w-full flex flex-col overflow-hidden">
                      <div
                        className="absolute top-0 left-0 pt-2 pb-2 bg-gray-400 cursor-pointer"
                        onClick={
                          expandSection !== 'BACKLOG'
                            ? () => setExpandSection('BACKLOG')
                            : () => setExpandSection('')
                        }
                      >
                        <div>
                          {expandSection !== 'BACKLOG' ? (
                            <ChevronLeft size="14" className="clickable" />
                          ) : (
                            <ChevronRight size="14" className="clickable" />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow-0 flex flex-row items-center mb-3 mt-4">
                        <div className="text-xl">Backlog</div>
                        <span className="text-sm p-2">{countsPhrase('story', unassigned)}</span>
                      </div>
                      <ArcherContainer
                        strokeColor="red"
                        className={`arrows-container h-screen overflow-scroll inactive`}
                        strokeWidth={2}
                        arrowLength={5}
                        strokeDasharray="3"
                      >
                        <div className="flex-grow overflow-scroll pr-6">
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
                      </ArcherContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* End Body */}
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
