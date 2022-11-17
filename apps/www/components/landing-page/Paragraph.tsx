import classNames from "classnames";
import type { FC, ReactNode } from "react";

export const Paragraph: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={classNames("leading-relaxed", className)}>{children}</p>;
};
