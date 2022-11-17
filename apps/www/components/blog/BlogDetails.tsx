import { format } from "date-fns";
import Link from "next/link";
import type { FC } from "react";
import type { Post } from "wesjet/jetpack";

import { Icon } from "../../components/common/Icon";

export const BlogDetails: FC<{ post: Post; className?: string }> = ({
  post,
  className,
}) => {
  return (
    <div className={`flex space-x-6 text-sm ${className}`}>
      <p className="mb-2 flex">
        <span className="mt-1 mr-2 block w-3 shrink-0 text-violet-600 dark:text-violet-400">
          <Icon name="calendar" />
        </span>
        <span>{format(new Date(post.date), "MMMM dd, yyyy")}</span>
      </p>
      <p className="flex">
        <span className="mt-1 mr-2 block w-3 shrink-0 text-violet-600 dark:text-violet-400">
          <Icon name="users" />
        </span>
      </p>
    </div>
  );
};
