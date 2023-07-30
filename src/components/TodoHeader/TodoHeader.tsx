/* eslint-disable jsx-a11y/control-has-associated-label */

import { useContext, useState } from 'react';

import { TodoContext } from '../../context/TodoContext';
import { USER_ID } from '../../utils/constants';
import { createTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

export const TodoHeader = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    setTodos,
    setErrorMessage,
    setTempTodo,
  } = useContext(TodoContext);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage(Error.TITLE);

      return;
    }

    try {
      setLoading(true);
      setQuery('');

      const newTodo = {
        userId: USER_ID,
        title: query,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      const createdTodo = await createTodo(newTodo as Todo);

      setTempTodo(null);
      setLoading(false);

      setTodos(
        (currentTodos: Todo[]) => [...currentTodos, createdTodo as Todo],
      );
    } catch (error) {
      setErrorMessage(Error.ADD);
    } finally {
      setLoading(false);
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
