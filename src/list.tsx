import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { For, createEffect, createSignal } from 'solid-js';
import { Task } from './task';
import { getTasks, isTaskData, type TTask } from './task-data';

export function List() {
  const [tasks, setTasks] = createSignal<TTask[]>(getTasks());

  createEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isTaskData(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }

        const sourceData = source.data;
        const targetData = target.data;

        if (!isTaskData(sourceData) || !isTaskData(targetData)) {
          return;
        }

        const indexOfSource = tasks().findIndex((task) => task.id === sourceData.taskId);
        const indexOfTarget = tasks().findIndex((task) => task.id === targetData.taskId);

        if (indexOfTarget < 0 || indexOfSource < 0) {
          return;
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        setTasks(
          reorderWithEdge({
            list: tasks(),
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: 'vertical',
          }),
        );
        const element = document.querySelector(`[data-task-id="${sourceData.taskId}"]`);
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  });

  return (
    <div class="pt-6 my-0 mx-auto w-[420px]">
      <div class="flex flex-col gap-2 border border-solid rounded p-2">
        <For each={tasks()}>{(task) => <Task task={task} />}</For>
      </div>
    </div>
  );
}
