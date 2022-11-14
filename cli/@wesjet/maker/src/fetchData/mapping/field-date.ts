import type * as core from "@wesjet/core";
import type { RelativePosixFilePath } from "@wesjet/utils";
import { Temporal } from "@wesjet/utils";
import { T } from "@wesjet/utils/effect";

import { FetchDataError } from "../../errors/index.js";

export const makeDateField = ({
  dateString,
  fieldName,
  options,
  documentFilePath,
  documentTypeDef,
}: {
  dateString: string;
  fieldName: string;
  options: core.PluginOptions;
  documentFilePath: RelativePosixFilePath;
  documentTypeDef: core.DocumentTypeDef;
}) =>
  T.tryCatch(
    () => {
      const dateHasExplitcitTimezone = () => {
        try {
          Temporal.TimeZone.from(dateString);
          return true;
        } catch {
          return false;
        }
      };

      if (
        options.date?.timezone !== undefined &&
        dateHasExplitcitTimezone() === false
      ) {
        const instant = new Date(dateString).toTemporalInstant();
        const desiredTimezone = Temporal.TimeZone.from(options.date.timezone);
        const offsetNs = desiredTimezone.getOffsetNanosecondsFor(instant);

        return instant.subtract({ nanoseconds: offsetNs }).toString();
      } else {
        return new Date(dateString).toISOString();
      }
    },
    () =>
      new FetchDataError.IncompatibleFieldDataError({
        documentFilePath,
        documentTypeDef,
        incompatibleFieldData: [[fieldName, dateString]],
      })
  );
