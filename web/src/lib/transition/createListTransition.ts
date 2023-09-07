import {
  $TRACK,
  Accessor,
  createComputed,
  createSignal,
  untrack,
  useTransition,
} from "solid-js";
import { isServer } from "solid-js/web";
import {
  arrayEquals,
  makeSetItem,
  noop,
  noopAsync,
  trackTransitionPending,
} from "./utils";

export type ExitMethod = "remove" | "move-to-end" | "keep-index";

export type InterruptMethod = "cancel" | "wait" | "none";

export type ListTransitionOptions = {
  /** whether to run the transition on the initial elements. Defaults to `false` */
  appear?: boolean;
  /**
   * This controls what happens when a transition is interrupted. This can happen when an element exits before an enter transition has completed, or vice versa. {@link InterruptMethod}
   * - `"cancel"` (default) abandons the current transition and starts the interrupting one as soon as it happens.
   * - `"wait"` waits for the current transition to complete before starting the most recently interrupting transition.
   * - `"none"` ignores the interrupting transition entirely
   */
  interruptMethod?: InterruptMethod;
  /**
   * This controls how the elements exit. {@link ExitMethod}
   * - `"remove"` removes the element immediately.
   * - `"move-to-end"` (default) will move elements which have exited to the end of the array.
   * - `"keep-index"` will splice them in at their previous index.
   */
  exitMethod?: ExitMethod;
};

type TransitionItemState =
  | "initial"
  | "entering"
  | "entered"
  | "exiting"
  | "exited";

type TransitionCallback = () => () => Promise<unknown>;

type TransitionControl = () => () => Promise<void>;

type TransitionItemContext = {
  state: Accessor<TransitionItemState>;
  useEnter(callback: TransitionCallback): void;
  useExit(callback: TransitionCallback): void;
  useRemain(callback: TransitionCallback): void;
};

type TransitionItemControls = {
  enter: TransitionControl;
  exit: TransitionControl;
  remain: TransitionControl;
};

type TransitionItem<T> = [T, TransitionItemContext, TransitionItemControls];

class TransitionInterruptError extends Error {
  static ignore(error: any) {
    if (!(error instanceof TransitionInterruptError)) {
      throw error;
    }
  }
}

function createTransitionItem<T>(
  el: T,
  options: ListTransitionOptions
): TransitionItem<T> {
  const [state, setState] = createSignal<TransitionItemState>("initial");
  const cancelSet = new Set<() => void>();
  const enterCallbacks = new Set<TransitionCallback>();
  const exitCallbacks = new Set<TransitionCallback>();
  const remainCallbacks = new Set<TransitionCallback>();

  const makeTransitionControl: (
    callbackSet: Set<TransitionCallback>,
    startState: TransitionItemState,
    endState: TransitionItemState
  ) => TransitionControl =
    options.interruptMethod === "cancel"
      ? (callbackSet, startState, endState) => () => {
          for (const cancel of cancelSet) {
            cancel();
          }

          let cancel: () => void;

          const cancelPromise = new Promise((_, reject) => {
            cancel = () => {
              reject(new TransitionInterruptError());
            };
            cancelSet.add(cancel);
          });

          const callbacks = Array.from(callbackSet).map((callback) =>
            callback()
          );

          setState(startState);

          return () =>
            Promise.race([
              Promise.all(callbacks.map((callback) => callback())),
              cancelPromise,
            ])
              .then(() => {
                setState(endState);
              })
              .finally(() => {
                cancelSet.delete(cancel);
              });
        }
      : () => () => noopAsync;

  return [
    el,
    {
      state,
      useEnter(callback: TransitionCallback) {
        makeSetItem(enterCallbacks, callback);
      },
      useExit(callback: TransitionCallback) {
        makeSetItem(exitCallbacks, callback);
      },
      useRemain(callback: TransitionCallback) {
        makeSetItem(remainCallbacks, callback);
      },
    },
    {
      enter: makeTransitionControl(enterCallbacks, "entering", "entered"),
      exit: makeTransitionControl(exitCallbacks, "exiting", "exited"),
      remain() {
        return () =>
          Promise.all(
            Array.from(remainCallbacks).map((callback) => callback()())
          ).then(noop);
      },
    },
  ];
}

/**
 * Create an element list transition interface for changes to the list of elements.
 * It can be used to implement own transition effect, or a custom `<TransitionGroup>`-like component.
 *
 * It will observe {@link source} and return a signal with array of elements to be rendered (current ones and exiting ones).
 *
 * @param source a signal with the current list of elements.
 * Any object can used as the element, but most likely you will want to use a `HTMLElement` or `SVGElement`.
 * @param options transition options {@link ListTransitionOptions}
 */
export function createListTransition<T extends object>(
  source: Accessor<readonly T[]>,
  options: ListTransitionOptions
): Accessor<[T, TransitionItemContext][]> {
  const initSource = untrack(source);

  if (isServer) {
    const copy = initSource.slice().map<[T, TransitionItemContext]>((item) => [
      item,
      {
        state: () => "initial",
        useEnter() {},
        useExit() {},
        useRemain() {},
      },
    ]);
    return () => copy;
  }

  // if appear is enabled, the initial transition won't have any previous elements.
  // otherwise the elements will match and transition skipped, or transitioned if the source is different from the initial value
  let prevSet: ReadonlySet<T> = new Set(
    options.appear ? undefined : initSource
  );

  const [result, setResult] = createSignal<TransitionItem<T>[]>(
    options.appear
      ? []
      : initSource.slice().map((el) => createTransitionItem(el, options)),
    { equals: arrayEquals }
  );

  const [toRemove, setToRemove] = createSignal<T[]>([], { equals: false });

  const [isTransitionPending] = useTransition();

  const finishRemoved: (el: T) => void =
    options.exitMethod === "remove"
      ? noop
      : (el) => {
          setToRemove((p) => [...p, el]);
        };

  const handleExiting: (
    items: TransitionItem<T>[],
    item: TransitionItem<T>,
    i: number
  ) => void =
    options.exitMethod === "remove"
      ? noop
      : options.exitMethod === "keep-index"
      ? (items, item, i) => items.splice(i, 0, item)
      : (items, item) => items.push(item);

  createComputed(() => {
    console.log("computed");
    const sourceList = source();
    const elsToRemove = toRemove();
    (sourceList as any)[$TRACK]; // top level store tracking

    trackTransitionPending(isTransitionPending, () => {
      untrack(() => {
        const resultValue = result();
        const resultSet = new Set(resultValue.map(([el]) => el));

        if (elsToRemove.length) {
          console.log("elsToRemove", elsToRemove);
          const next = resultValue.filter(([el]) => !elsToRemove.includes(el));
          elsToRemove.length = 0;
          setResult(next);
          return;
        }

        const nextSet: ReadonlySet<T> = new Set(sourceList);
        const next: TransitionItem<T>[] = [];
        const entering: TransitionItem<T>[] = [];
        const exiting: TransitionItem<T>[] = [];
        const remaining: TransitionItem<T>[] = [];

        for (let i = 0; i < sourceList.length; i++) {
          const el = sourceList[i]!;
          if (prevSet.has(el)) {
            const item = resultValue.find(([prevEl]) => prevEl === el)!;
            next.push(item);
            remaining.push(item);
          } else if (resultSet.has(el)) {
            const item = resultValue.find(([prevEl]) => prevEl === el)!;
            next.push(item);
            entering.push(item);
          } else {
            console.log("add", el);
            const item = createTransitionItem(el, options);
            next.push(item);
            entering.push(item);
          }
        }

        for (let i = 0; i < resultValue.length; i++) {
          const item = resultValue[i]!;
          const [el] = item;
          if (!nextSet.has(el)) {
            handleExiting(next, item, i);
            if (prevSet.has(el)) {
              console.log("remove", el);
              exiting.push(item);
            }
          }
        }

        prevSet = nextSet;
        setResult(next);

        queueMicrotask(() => {
          const callbacks: Array<() => Promise<void>> = [];

          for (let i = 0; i < exiting.length; i++) {
            const [el, , controls] = exiting[i]!;
            const callback = controls.exit();
            callbacks.push(() =>
              callback().then(() => {
                console.log("finishRemoved");
                finishRemoved(el);
              })
            );
          }

          for (let i = 0; i < entering.length; i++) {
            const [, , controls] = entering[i]!;
            callbacks.push(controls.enter());
          }

          for (let i = 0; i < remaining.length; i++) {
            const [, , controls] = remaining[i]!;
            callbacks.push(controls.remain());
          }

          for (let i = 0; i < callbacks.length; i++) {
            callbacks[i]?.().catch(TransitionInterruptError.ignore);
          }
        });
      });
    });
  });

  return result as unknown as Accessor<[T, TransitionItemContext][]>;
}
