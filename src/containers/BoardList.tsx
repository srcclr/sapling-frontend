import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import IStoreState, { IBoardState, IBoardListState } from 'store/IStoreState';
import { getActions } from 'actions/boardActions';
import { ISprint } from 'types';

import { Button, EditableText } from '@blueprintjs/core';
import { timingSafeEqual } from 'crypto';
import { ReactTestInstance } from 'react-test-renderer';
import ContentWrapper from 'components/ContentWrapper';

interface IBoardProps {
  label: string;
  values: string[];
  history: any;
  match: any;
  boardState: IBoardState;
  boardListState: IBoardListState;
}

interface IState {
  inputBoardName: string;
}

export class Board extends React.Component<
  IBoardProps & ReturnType<typeof mapDispatchToProps>,
  IState
  > {
  private boardName;

  constructor(props) {
    super(props);

    this.state = {
      inputBoardName: '',
    };
  }

  public componentDidMount() {
    this.refreshBoardList();
  }

  public handleCreateNewBoard = (e: React.FormEvent) => {
    e.preventDefault();
    const { inputBoardName } = this.state;
    this.setState({ inputBoardName: '' });
    this.props.actions.createBoard(inputBoardName).then(this.refreshBoardList);
  };

  public handleDeleteBoard = id => {
    this.props.actions.deleteBoard(id).then(this.refreshBoardList);
  };

  public handleInputBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputBoardName: e.target.value });
  };

  public refreshBoardList = () =>
    this.props.actions.fetchBoardList()
    ;

  public render() {
    const { boardListState } = this.props;
    const { data: boards } = boardListState;
    const { inputBoardName } = this.state;
    const { isFetchingBoardList } = boardListState;

    return (
      <ContentWrapper isLoading={isFetchingBoardList} overlayLoader={true}>
        <div className="col-4 mx-auto mt4 pt4">
          <h1 className="mr2">Boards</h1>

          <div className="flex row items-center ">
            <form className="bp3-input-group" onSubmit={this.handleCreateNewBoard}>
              <input
                className="bp3-input"
                name="inputBoardName"
                placeholder="A board's name"
                dir="auto"
                value={inputBoardName}
                onChange={this.handleInputBoardNameChange}
              />
              <button
                className="bp3-button bp3-minimal bp3-intent-warning bp3-icon-plus"
                disabled={!inputBoardName}
              />
            </form>
          </div>
          {boards.map((board, index) => {
            const { id, name, owner } = board;
            return (
              <div
                key={index}
                className="my2 flex row justify-between items-center h3"
                to={`/boards/${id}`}
              >
                <div className="mr1 col-1 h5">{id}</div>
                <div className="col-8">
                  <Link key={index} className="text" to={`/boards/${id}`}>
                    {name}
                  </Link>
                </div>
                <button
                  className="bp3-button bp3-minimal bp3-intent-warning bp3-icon-cross bp3-intent-none"
                  onClick={this.handleDeleteBoard.bind(this, id)}
                />
              </div>
            );
          })}
        </div>
      </ContentWrapper>
    );
  }
}

function mapStateToProps(state: IStoreState) {
  return {
    boardState: state.boardState,
    boardListState: state.boardListState,
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
