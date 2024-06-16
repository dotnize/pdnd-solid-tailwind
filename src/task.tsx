import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { GripVertical } from 'lucide-solid';
import { createEffect, createSignal, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import invariant from 'tiny-invariant';
import { DropIndicator } from './drop-indicator';
import { Status } from './status';
import { getTaskData, isTaskData, type TTask } from './task-data';

// type TaskState =
//   | {
//       type: 'idle';
//     }
//   | {
//       type: 'preview';
//       container: HTMLElement;
//     }
//   | {
//       type: 'is-dragging';
//     }
//   | {
//       type: 'is-dragging-over';
//       closestEdge: Edge | null;
//     };

// Type narrowing is tricky with Solid's signal accessors
interface TaskState {
  type: 'idle' | 'preview' | 'is-dragging' | 'is-dragging-over';
  container?: HTMLElement;
  closestEdge?: Edge | null;
}

const stateStyles: { [Key in TaskState['type']]?: JSX.HTMLAttributes<HTMLDivElement>['class'] } = {
  'is-dragging': 'opacity-40',
};

const idle: TaskState = { type: 'idle' };

export function Task(props: { task: TTask }) {
  let ref: HTMLDivElement | undefined = undefined;
  const [state, setState] = createSignal<TaskState>(idle);

  createEffect(() => {
    const element = ref;
    const task = props.task;
    invariant(element);

    draggable({
      element,
      getInitialData() {
        return getTaskData(task);
      },
      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: pointerOutsideOfPreview({
            x: '16px',
            y: '8px',
          }),
          render({ container }) {
            setState({ type: 'preview', container });
          },
        });
      },
      onDragStart() {
        setState({ type: 'is-dragging' });
      },
      onDrop() {
        setState(idle);
      },
    });

    dropTargetForElements({
      element,
      canDrop({ source }) {
        // not allowing dropping on yourself
        if (source.element === element) {
          return false;
        }
        // only allowing tasks to be dropped on me
        return isTaskData(source.data);
      },
      getData({ input }) {
        const data = getTaskData(task);
        return attachClosestEdge(data, {
          element,
          input,
          allowedEdges: ['top', 'bottom'],
        });
      },
      getIsSticky() {
        return true;
      },
      onDragEnter({ self }) {
        const closestEdge = extractClosestEdge(self.data);
        setState({ type: 'is-dragging-over', closestEdge });
      },
      onDrag({ self }) {
        const closestEdge = extractClosestEdge(self.data);

        // Only need to update state if nothing has changed.
        // Prevents re-rendering.
        setState((current) => {
          if (current.type === 'is-dragging-over' && current.closestEdge === closestEdge) {
            return current;
          }
          return { type: 'is-dragging-over', closestEdge };
        });
      },
      onDragLeave() {
        setState(idle);
      },
      onDrop() {
        setState(idle);
      },
    });
  });

  return (
    <>
      <div class="relative">
        <div
          // Adding data-attribute as a way to query for this for our post drop flash
          data-task-id={props.task.id}
          ref={ref}
          class={`flex text-sm bg-white flex-row items-center border border-solid rounded p-2 pl-0 hover:bg-slate-100 hover:cursor-grab ${stateStyles[state().type] ?? ''}`}
        >
          <div class="w-6 flex justify-center">
            <GripVertical size={10} />
          </div>
          <span class="truncate flex-grow flex-shrink">{props.task.content}</span>
          <Status status={props.task.status} />
        </div>
        {state().type === 'is-dragging-over' && state().closestEdge ? (
          <DropIndicator edge={state().closestEdge!} gap={'8px'} />
        ) : null}
      </div>
      {state().type === 'preview' ? (
        <Portal mount={state().container}>
          <DragPreview task={props.task} />
        </Portal>
      ) : null}
    </>
  );
}

// A simplified version of our task for the user to drag around
function DragPreview(props: { task: TTask }) {
  return <div class="border-solid rounded p-2 bg-white">{props.task.content}</div>;
}
