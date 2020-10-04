import { bhv } from 'dkt/core';

export const App = bhv({
  attrs: {
    todos: ['input', []],
    activeItems: ['comp', ['todos'], (todos = []) => todos.filter(todo => !todo.completed)],
    completedItems: ['comp', ['todos'], (todos = []) => todos.filter(todo => todo.completed)],

    leftItems: ['comp', ['activeItems'], (todos = []) => todos.length],
    isListVisible: ['comp', ['todos'], (todos = []) => todos.length > 0],
    isAllTodosCompleted: ['comp', ['activeItems'], (todos = []) => todos.length === 0],
  },
  actions: {
    addTodo: {
      to: ['todos'],
      fn: [['todos'], ({ title }, list = []) => [...list, { id: list.length + 1, title, completed: false }]],
    },
    updateTodo: {
      to: ['todos'],
      fn: [['todos'], ({ id, title }, list = []) => list.map(i => (i.id === Number(id) ? { ...i, title } : i))],
    },
    toggleTodo: {
      to: ['todos'],
      fn: [['todos'], (id, list = []) => list.map(i => (i.id === Number(id) ? { ...i, completed: !i.completed } : i))],
    },
    toggleAllTodos: {
      to: ['todos'],
      fn: [
        ['todos'],
        (_data, list = []) => {
          const isAllCompleted = list.every(i => i.completed);
          return list.map(i => ({ ...i, completed: !isAllCompleted }));
        },
      ],
    },
    removeTodo: {
      to: ['todos'],
      fn: [['todos'], (id, list = []) => list.filter(i => i.id !== Number(id))],
    },
    clearCompleted: {
      to: ['todos'],
      fn: [['todos'], (id, list = []) => list.filter(i => !i.completed)],
    },
  },
});
