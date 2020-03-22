import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Trash, Edit2, ChevronRight } from 'react-feather';
import { useForm } from 'react-hook-form';

import { deleteBoard } from 'actions/boardActions';
import { fetchBoardList, createBoard } from 'actions/boardListActions';
import { BoundActionsObjectMap } from 'actions/actionTypes';
import IStoreState, { IBoardListState, IMyState } from 'store/IStoreState';
import { IBoard } from '../types';
import { Dialog, SquareSpinner } from 'styles/ThemeComponents';

function BoardList() {
  const { handleSubmit, register, reset, watch } = useForm();
  const storeState = useSelector<
    IStoreState,
    { boardListState: IBoardListState; myState: IMyState }
  >(state => ({
    boardListState: state.boardListState,
    myState: state.myState,
  }));

  const { boardListState = {}, myState = {} } = storeState;
  const { id } = myState;

  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, BoundActionsObjectMap>(
    { fetchBoardList, createBoard, deleteBoard },
    dispatch
  );

  const handleCreateBoard = values => {
    const { boardName } = values;
    actions
      .createBoard(boardName, id)
      .then(() => {
        toast.info('New board created', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
        });
        actions.fetchBoardList();
        reset();
      })
      .catch(() => {
        toast.error('Error creating board');
      });
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<IBoard>({});
  const handleDeleteBoard = (board: IBoard) => {
    setIsDeleteDialogOpen(true);
    setBoardToDelete(board);
  };

  const handleConfirmDelete = () => {
    const { id: boardId } = boardToDelete;
    actions.deleteBoard(boardId).then(() => {
      toast.info('Deleted successfully');
      actions.fetchBoardList();
    });
  };

  useEffect(() => {
    actions.fetchBoardList();
  }, []);

  const { isFetching, data: boards = [] } = boardListState;

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const boarNameWatch = watch('boardName');
  const { id: boardIdToDelete, name: boardNameToDelete } = boardToDelete;
  return (
    <div className="max-w-xl w-1/3 mx-auto pt-20 relative">
      <h1 className="text-gray-700 font-bold text-xl">Boards</h1>
      <form onSubmit={handleSubmit(handleCreateBoard)} className="flex flex-row items-center">
        <input
          type="text"
          className="w-full mb-5 mt-5 mr-1"
          name="boardName"
          placeholder="Name of your new dazzling board"
          required={true}
          autoFocus
          ref={register({ required: true })}
        />
        <button className="btn btn-primary" type="submit" disabled={!boarNameWatch}>
          Add
        </button>
      </form>
      {isFetching ? (
        <SquareSpinner className="mt-20" />
      ) : boards.length > 0 ? (
        boards.map((board, i) => {
          const { id, name } = board || {};
          return (
            <div key={i} className="flex row items-center">
              <Link to={`/boards/${id}`} className="text-2xl font-light leading-relaxed mr-2">
                {name}
              </Link>{' '}
              <span className="tag">#{id}</span>
              <div className="flex row pl-2">
                {/* <div className="mr-1">
                  <Edit2 size="16" className="clickable" />
                </div> */}
                <Trash size="16" className="clickable" onClick={() => handleDeleteBoard(board)} />
              </div>
            </div>
          );
        })
      ) : (
        <div className="italic text-gray-400 text-center">
          No boards founds, create your first one!
        </div>
      )}
      <div className="border-t-2 border-dotted border-gray-200 py-4 mt-4">
        <Link
          to={`/boards/dependencies`}
          className="text-1xl font-light leading-relaxed mr-2 flex flex-row items-center"
        >
          Dependencies <ChevronRight size="14" />
        </Link>
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        closeOnOutsideClick={true}
        className="w-1/3"
        intent="danger"
      >
        <div className="mb-3">
          You are deleting board:{' '}
          <div className="flex flex-row items-center mt-4">
            <span className="tag mr-2">{boardIdToDelete}</span>
            <div className="text-lg">{boardNameToDelete}</div>
          </div>
        </div>

        <div>This will delete all stories under this board. Are you sure you want to delete?</div>
      </Dialog>
    </div>
  );
}

export default BoardList;
