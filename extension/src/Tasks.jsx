import { useState, useRef } from 'react';
import { TextField, IconButton, Button } from '@pane-ui/react';
import { Icon } from './Icon.jsx';
import { TaskRow } from './TaskRow.jsx';
import { PREFIX } from './model.js';
import { store } from './storage.js';
const id = () => crypto.randomUUID();
export function Tasks({ ws, hidden }) {
  const [taskText, setTaskText] = useState(''),
    [undo, setUndo] = useState(null),
    [taskBusy, setTaskBusy] = useState(false);
  const taskInput = useRef(null),
    taskDraft = useRef(''),
    taskDraftId = useRef(null);
  const completed = ws.tasks.filter((t) => t.done).length;
  const addTask = async (e) => {
    e.preventDefault();
    const text = taskText.trim();
    if (!text || taskBusy) return;
    setTaskBusy(true);
    taskDraftId.current ??= id();
    const record = { id: taskDraftId.current, text, done: false, createdAt: Date.now() };
    await ws.run(async () => {
      await store.set({ [`${PREFIX}task.${record.id}`]: record });
      if (taskDraft.current.trim() === text) {
        setTaskText('');
        taskDraft.current = '';
      }
      if (taskDraftId.current === record.id) taskDraftId.current = null;
      taskInput.current?.focus();
    }, 'task-create');
    setTaskBusy(false);
  };
  const removeTask = async (task) => {
    if (await ws.run(() => store.remove(`${PREFIX}task.${task.id}`), `task.${task.id}`)) {
      setUndo(task);
      taskInput.current?.focus();
    }
  };

  return (
    <div hidden={hidden}>
      <section className="tasks-panel" aria-labelledby="tasks-heading">
        <div className="section-line">
          <h2 id="tasks-heading">today</h2>
          <span className="task-count">
            {ws.tasks.length ? `${completed} / ${ws.tasks.length}` : 'a fresh start'}
          </span>
        </div>
        {ws.tasks.length > 0 ? (
          <ul className="tasks">
            {ws.tasks.map((task) => (
              <TaskRow key={task.id} task={task} run={ws.run} remove={removeTask} />
            ))}
          </ul>
        ) : (
          <p className="empty-tasks">
            What would make today a good day?
            <br />
            <span>Start with one small thing.</span>
          </p>
        )}
        <form className="add-task" onSubmit={addTask}>
          <TextField
            ref={taskInput}
            aria-label="New task"
            placeholder="Add a task"
            maxLength={300}
            value={taskText}
            onChange={(e) => {
              setTaskText(e.target.value);
              taskDraft.current = e.target.value;
            }}
            disabled={taskBusy}
          />
          <IconButton
            type="submit"
            label="Add task"
            icon={<Icon name="plus" />}
            disabled={!taskText.trim() || taskBusy}
          />
        </form>
        {undo && (
          <div className="undo" role="status">
            Task removed.
            <Button
              variant="subtle"
              onClick={async () => {
                if (
                  await ws.run(
                    () => store.set({ [`${PREFIX}task.${undo.id}`]: undo }),
                    `task.${undo.id}`,
                  )
                )
                  setUndo(null);
              }}
            >
              Undo
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
