import React from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, Button } from '@blueprintjs/core';
import { AppToaster } from 'components/toaster';

import SplitPane from 'react-split-pane';
import IStoreState, { IBoardState, IEpicsListState } from 'store/IStoreState';
import { getActions } from 'actions/boardActions';
import { ISprint, ITicket } from 'types';

import ContentWrapper from 'components/ContentWrapper';
import BoardForm from 'components/BoardForm';
import EpicsList from 'containers/EpicsList';

interface IBoardProps {
  label: string;
  values: string[];
  history: any;
  match: any;
  boardState: IBoardState;
  epicsListState: IEpicsListState;
}

interface IState {
  isSidePaneOpen: boolean;
}

export class Board extends React.Component<
  IBoardProps & ReturnType<typeof mapDispatchToProps>,
  IState
> {
  constructor(props) {
    super(props);

    this.state = {
      isSidePaneOpen: true,
    };
  }

  public componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { boardId } = params;
    this.props.actions.fetchBoard(boardId);
  }

  public handleCreateSprint = values => {
    const { boardState } = this.props;
    const { data } = boardState;
    const { id } = data;
    this.props.actions
      .createSprint(id)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Sprint created.</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to create sprint.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleAddDependency = addingAlready => {
    this.props.actions.addDependencyStart(addingAlready);
  };

  public handleShowDependencies = (show, deps) => {
    if (show) {
      this.props.actions.showDependencies(deps);
    } else {
      this.props.actions.showDependencies([]);
    }
  };

  public handleDeleteDependency = (from, to) => {
    let board = this.props.boardState.data.id;
    this.props.actions
      .deleteDependency1(board, from, to)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Dependency deleted.</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to delete dependency.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleSelectDependency = (id, isAddingDependency, dependant) => {
    if (!isAddingDependency) {
      return;
    }
    if (!dependant) {
      this.props.actions.addDependency1(id);
    } else {
      let boardId = this.props.boardState.data.id;
      this.props.actions
        .addDependency2(boardId, dependant, id)
        .then(res => {
          AppToaster.show({
            message: (
              <>
                <strong>Dependency added.</strong>
              </>
            ),
            intent: 'success',
            timeout: 1000,
          });
        })
        .catch(error => {
          AppToaster.show({
            icon: 'warning-sign',
            message: (
              <>
                <strong>Failed to add dependency.</strong>
              </>
            ),
            intent: 'danger',
            timeout: 1000,
          });
          error && error.message && console.error(error.message);
        });
    }
  };

  public handleUpdateSprint = (sprint: ISprint) => {
    this.props.actions
      .updateSprint(sprint)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Sprint updated.</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to update sprint.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleUpdateTicket = (ticket: ITicket) => {
    this.props.actions
      .updateTicket(this.props.boardState.data.id, ticket)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Story updated.</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to update ticket.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleDeleteSprint = sprintId => {
    this.props.actions
      .deleteSprint(sprintId)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Sprint deleted.</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to delete sprint.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleCreateTicket = values => {
    const { boardState = {} } = this.props;
    const { data = {} } = boardState;
    const { id } = data;
    this.props.actions
      .createTicket(id)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Story created.</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to create story.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleDeleteTicket = ticketId => {
    this.props.actions
      .deleteTicket(ticketId)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Story deleted.</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to delete story.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleExportCsv = () => {
    const { boardState = {} } = this.props;
    const { data = {} } = boardState;
    const { id } = data;
    this.props.actions.exportCsv(id);
  };

  // Not being used just yet
  public handleBoardDetailsChange = details => {
    const { boardState } = this.props;
    const { data } = boardState;
    const { id } = data;
    this.props.actions.updateBoard(id, details);
  };

  public handleSubmit = values => {
    const { match } = this.props;
    const { params } = match;
    const { boardId } = params;
    this.props.actions
      .solve(boardId)
      .then(res => {
        AppToaster.show({
          message: (
            <>
              <strong>Solved!</strong>
            </>
          ),
          intent: 'success',
          timeout: 1000,
        });
      })
      .catch(error => {
        const { message, status } = error;
        const errorMessage =
          status === 406
            ? 'No solution could be found.'
            : status >= 500
              ? 'An unexpected error occurred.'
              : message;

        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>{errorMessage}</strong>
            </>
          ),
          intent: 'danger',
          timeout: 5000,
        });
      });
  };

  public render() {
    const { match, boardState, epicsListState } = this.props;
    const { isFetchingBoard, isUpdatingBoard, isExportingCsv } = boardState;
    const { params } = match;
    const { boardId } = params;
    const { data: epics = [] } = epicsListState;
    const { dependant, isAddingDependency, shownDependencies } = boardState;
    const { sprints = [] } = boardState.data;
    const { isSidePaneOpen } = this.state;
    return (
      <div className="col-12 mx-auto">
        <ContentWrapper isLoading={isFetchingBoard}>
          <SplitPane
            split="vertical"
            minSize={isSidePaneOpen ? 300 : 25}
            maxSize={isSidePaneOpen ? 500 : 25}
            primary="second"
            pane1Style={{ overflow: 'auto' }}
          >
            <ContentWrapper isLoading={isUpdatingBoard} overlayLoader={true}>
              <div className="overflow-scroll">
                <div className="mb1 bg-white">
                  <Link to={'/boards'} className="mb1 bold h4">
                    <Icon icon="chevron-left" />
                    Boards
                  </Link>
                </div>
                <BoardForm
                  isAddingDependency={isAddingDependency}
                  isExportingCsv={isExportingCsv}
                  dependant={dependant}
                  onSubmit={this.handleSubmit}
                  onExportCsv={this.handleExportCsv}
                  onCreateTicket={this.handleCreateTicket}
                  onAddDependency={this.handleAddDependency}
                  onDeleteDependency={this.handleDeleteDependency}
                  onShowDependencies={this.handleShowDependencies}
                  shownDependencies={shownDependencies}
                  onSelectDependency={this.handleSelectDependency}
                  onCreateSprint={this.handleCreateSprint}
                  onUpdateTicket={this.handleUpdateTicket}
                  onUpdateSprint={this.handleUpdateSprint}
                  onDeleteSprint={this.handleDeleteSprint}
                  onDeleteTicket={this.handleDeleteTicket}
                  epics={epics}
                  sprints={sprints}
                />
              </div>
            </ContentWrapper>
            <div id="side-pane" className={`flex row`}>
              <div className="pt1 ">
                <Button
                  icon={isSidePaneOpen ? 'chevron-right' : 'chevron-left'}
                  minimal={true}
                  small={true}
                  onClick={() => this.setState({ isSidePaneOpen: !isSidePaneOpen })}
                />
              </div>
              <div className={`px3`}>
                <EpicsList boardId={boardId} />
              </div>
            </div>
          </SplitPane>
        </ContentWrapper>
      </div>
    );
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    boardState: state.boardState,
    epicsListState: state.epicsListState,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators(getActions(), dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
