import React, { useState } from 'react';

interface ITask {
  task: string;
  checked: boolean;
  id: number;
}

function App() {
  const [tasks, setTasks] = useState([] as Array<ITask>);
  const [firstNew, setNewFirst] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      task: { value: string };
    };
    const task = target.task.value;
    setTasks((current) => {
      if (firstNew) {
        return [{ task, checked: false, id: Date.now() }, ...current];
      } else {
        return [...current, { task, checked: false, id: Date.now() }];
      }
    });
    e.currentTarget.reset();
  };

  const handleChecked = (id: number) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task,
      ),
    );
  };

  const handleTaskRemove = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const handleSortByNew = () => {
    setTasks([...tasks.reverse()]);
    setNewFirst((current) => !current);
  };

  const handleSetCheckedOnTop = () => {
    setTasks((current) => {
      const { checked, unChecked } = current.reduce(
        (acc, task) =>
          task.checked
            ? { ...acc, checked: [...acc.checked, task] }
            : { ...acc, unChecked: [...acc.unChecked, task] },
        { checked: [] as ITask[], unChecked: [] as ITask[] },
      );
      return [...checked, ...unChecked];
    });
  };

  return (
    <div
      style={{
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='put task' name='task' />
        <button style={{ marginLeft: '10px' }} type='submit'>
          add
        </button>
      </form>
      <div>
        <button
          style={{ marginRight: '10px' }}
          onClick={handleSortByNew}
        >{`New first: ${firstNew}`}</button>
        <button onClick={handleSetCheckedOnTop}>Checked on top</button>
      </div>
      <div>
        {tasks.map(({ task, checked, id }) => (
          <div key={id} style={{ padding: '5px 0' }}>
            <input
              type='checkbox'
              checked={checked}
              onChange={() => {
                handleChecked(id);
              }}
            />
            <span>{task}</span>
            <button
              style={{ marginLeft: '10px' }}
              onClick={() => handleTaskRemove(id)}
            >
              remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
