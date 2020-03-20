import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChevronLeft } from 'react-feather';
import { fetchDependencies } from 'actions/dependenciesViewActions';
import { BoundActionsObjectMap } from 'actions/actionTypes';
import IStoreState, { IBoardListState, IMyState, IDependenciesViewState } from 'store/IStoreState';
import { SquareSpinner } from 'styles/ThemeComponents';
import { ArcherContainer, ArcherElement, Relation, AnchorPosition } from 'react-archer';
import { colors } from 'tailwindcss/defaultTheme';

function DependenciesView() {
  const storeState = useSelector<IStoreState, { dependenciesViewState: IDependenciesViewState }>(
    state => ({
      dependenciesViewState: state.dependenciesViewState,
    })
  );

  const { dependenciesViewState = {} } = storeState;

  const dispatch = useDispatch();
  const actions = bindActionCreators<{}, BoundActionsObjectMap>({ fetchDependencies }, dispatch);

  useEffect(() => {
    actions.fetchDependencies();
  }, []);

  const { isFetching, data } = dependenciesViewState;

  const teams = _.uniq(_.flatten(data.deps.map(d => [d.from.name, d.to.name])));
  const teamIds = _.mapValues(_.keyBy(teams.map((t, i) => ({ t, i })), 't'), t => t.i);

  const getId = (team, sprint) => `board-${teamIds[team]}-${sprint}`;

  const backlogId = data.maxSprint + 1;

  const depsBySourceId: { [id: string]: Relation[] } = _.mapValues(
    _.groupBy(
      data.deps.map(d => {
        const fromSprint = d.from.sprint || backlogId;
        const toSprint = d.to.sprint || backlogId;
        const key = getId(d.from.name, fromSprint);
        const sourceAnchor: AnchorPosition = fromSprint > toSprint ? 'left' : 'right';
        const targetAnchor: AnchorPosition = sourceAnchor === 'left' ? 'right' : 'left';
        const rel = { targetId: getId(d.to.name, toSprint), targetAnchor, sourceAnchor };
        return { key, rel };
      }),
      'key'
    ),
    t => t.map(x => x.rel)
  );

  const boxStyle = { padding: '10px', border: '1px solid black' };
  const tdStyle = { padding: '40px' };

  return (
    <div className="max-w-xl w-1/3 mx-auto pt-20 relative">
      <Link to="/boards" className="mb-2 flex flex-row items-center">
        <ChevronLeft size="14" /> Boards
      </Link>
      <h1 className="text-gray-700 font-bold text-xl">Dependencies</h1>

      {isFetching ? (
        <SquareSpinner className="mt-20" />
      ) : data ? (
        <ArcherContainer strokeColor={colors.teal[400]}>
          <table className="table-auto">
            <thead>
              <tr>
                <th />
                {_.range(data.maxSprint).map((s, i) => (
                  <th key={s + i}>Sprint {s + 1}</th>
                ))}
                <th>Backlog</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t, teamIndex) => (
                <tr key={t + teamIndex}>
                  <td>{t}</td>
                  {_.range(data.maxSprint).map(s => (
                    <td key={t + teamIndex + s} style={tdStyle}>
                      <ArcherElement
                        id={getId(t, s + 1)}
                        relations={depsBySourceId[getId(t, s + 1)]}
                      >
                        <div style={boxStyle}>
                          {t} sprint {s + 1}
                        </div>
                      </ArcherElement>
                    </td>
                  ))}
                  <td style={tdStyle}>
                    <ArcherElement
                      id={getId(t, backlogId)}
                      relations={depsBySourceId[getId(t, backlogId)]}
                    >
                      <div style={boxStyle}>{t} backlog</div>
                    </ArcherElement>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ArcherContainer>
      ) : (
        <div className="italic text-gray-400 text-center">No dependencies yet!</div>
      )}
    </div>
  );
}

export default DependenciesView;
