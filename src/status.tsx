import type { JSX } from 'solid-js';
import type { TStatus } from './task-data';

const bgColor: { [Key in TStatus]: JSX.HTMLAttributes<HTMLElement>['class'] } = {
  todo: 'bg-violet-200 ',
  'in-progress': 'bg-amber-200',
  done: 'bg-green-200',
};

const label: { [Key in TStatus]: string } = {
  todo: 'TODO',
  'in-progress': 'In progress',
  done: 'Done',
};

export function Status(props: { status: TStatus }) {
  return (
    <div class="flex w-[100px] justify-end">
      <span
        class={`${bgColor[props.status]} uppercase p-1 rounded font-semibold flex-shrink-0 text-xs text-slate-900 `}
      >
        {label[props.status]}
      </span>
    </div>
  );
}
