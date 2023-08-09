import clsx from "clsx";
import classes from "./MegaTitle.module.css";
import { typography } from "~/lib/typography";

export default function MegaTitle() {
  return (
    <h1 class={clsx(classes.title, typography.title)}>
      Jonas Luebbers
      <br />
      <br />
      Crea<span style={{ "margin-left": "-0.08em" }}>t</span>ive Developer
    </h1>
  );
}
