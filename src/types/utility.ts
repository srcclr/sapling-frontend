import { IBoard, ISprint, ITicket } from '../types';

export function findTicket(b: IBoard, ticketId: number, f: (t: ITicket) => void) {
  let g = (t: ITicket) => {
    if (t.id === ticketId) {
      f(t);
    }
  };
  b.sprints.forEach(s => s.tickets.forEach(g));
  b.unassigned.forEach(g);
}

export function findSprint(b: IBoard, sprintId: number, f: (t: ISprint) => void) {
  let g = (s: ITicket) => {
    if (s.id === sprintId) {
      f(s);
    }
  };
  b.sprints.forEach(g);
}

// Intended to be used on an immer proxy
export function mutateTicket(b: IBoard, ticket: ITicket) {
  findTicket(b, ticket.id, t => {
    t.description = ticket.description;
    t.weight = ticket.weight;
    t.epic = ticket.epic;
    t.pin = ticket.pin;
  });
}

// Intended to be used on an immer proxy
export function mutateSprint(b: IBoard, sprint: ISprint) {
  findSprint(b, sprint.id, s => {
    s.name = sprint.name;
    s.capacity = sprint.capacity;
  });
}

// Intended to be used on an immer proxy
export function deleteSprint(b: IBoard, sprintId: number) {
  let sprint = b.sprints.filter(s => s.id === sprintId)[0];
  b.sprints = b.sprints.filter(s => s.id !== sprintId);
  if (sprint.tickets) {
    sprint.tickets.forEach(t => b.unassigned.push(t));
  }
}

// Intended to be used on an immer proxy
export function deleteTicket(b: IBoard, ticketId: number) {
  b.sprints.forEach(s => (s.tickets = s.tickets.filter(t => t.id !== ticketId)));
  b.unassigned = b.unassigned.filter(t => t.id !== ticketId);
}

// Intended to be used on an immer proxy
export function addDependency(b: IBoard, from: number, to: number) {
  b.sprints.forEach(s =>
    s.tickets.filter(t => t.id === from).forEach(t => t.dependencies.push(to))
  );
  b.unassigned.filter(t => t.id === from).forEach(t => t.dependencies.push(to));
}

// Intended to be used on an immer proxy
export function deleteDependency(b: IBoard, from: number, to: number) {
  b.sprints.forEach(s =>
    s.tickets
      .filter(t => t.id === from)
      .forEach(t => (t.dependencies = t.dependencies.filter(d => d !== to)))
  );
  b.unassigned
    .filter(t => t.id === from)
    .forEach(t => (t.dependencies = t.dependencies.filter(d => d === to)));
}
