import clsx from "clsx";
import { ComponentProps } from "solid-js";
import { typography } from "~/lib/typography";
import classes from "./Main.module.css";

export function Main(props: ComponentProps<"main">) {
  return (
    <main
      {...props}
      class={clsx(classes.main, typography.size1, props.class)}
    />
  );
}
