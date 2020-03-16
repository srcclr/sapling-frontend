import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import IStoreState, { IEpicsListState } from 'store/IStoreState';
import { getActions } from 'actions/epicsActions';
import { AppToaster } from 'components/toaster';
import EpicsListItem from 'components/EpicsListItem';
import EpicsListForm from 'components/EpicsListForm';

interface IEpicsProps {
  boardId: number;
  epicsListState: IEpicsListState;
}

export class EpicsList extends React.Component<
  IEpicsProps & ReturnType<typeof mapDispatchToProps>
> {
  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.refreshEpics();
  }

  public handleAddNewEpic = values => {
    const { name, priority } = values;
    const epicData = {
      name,
      priority,
    };
    const { boardId } = this.props;
    this.props.actions
      .createEpic(boardId, epicData)
      .then(res => {
        this.refreshEpics();
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to create epic.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public handleDeleteEpic = id => {
    this.props.actions
      .deleteEpic(id)
      .then(res => {
        this.refreshEpics();
      })
      .catch(error => {
        AppToaster.show({
          icon: 'warning-sign',
          message: (
            <>
              <strong>Failed to delete epic.</strong>
            </>
          ),
          intent: 'danger',
          timeout: 1000,
        });
        error && error.message && console.error(error.message);
      });
  };

  public refreshEpics = () => {
    const { boardId } = this.props;
    this.props.actions.fetchEpicsList(boardId);
  };

  public render() {
    const { epicsListState } = this.props;
    const { data: epics } = epicsListState;

    return (
      <div className="col-12 mx-auto">
        <div className="mb1">
          <h2 className="flex row items-center">
            Epics {epics && epics.length && <span className="bp3-tag ml2">{epics.length}</span>}
          </h2>
          <EpicsListForm onSubmit={this.handleAddNewEpic} />
        </div>
        {epics.map((epic, index) => {
          const { id, name, priority } = epic;
          return (
            <EpicsListItem
              key={index}
              id={id}
              name={name}
              priority={priority}
              onDelete={this.handleDeleteEpic}
            />
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    epicsListState: state.epicsListState,
    boardState: state.boardState,
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
)(EpicsList);
