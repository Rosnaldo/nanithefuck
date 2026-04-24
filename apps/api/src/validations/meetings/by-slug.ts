import z from "zod";
import { validateParse, ValidateParseResult } from "#utils/zod/validate_parse";
import { IMeeting } from "@repo/shared-types";
import { MeetingUtils } from "#schemas/meeting/utils";
import { makeObjectIdSchema } from "#utils/zod/valid_objectid_schema";
import { makeDateSchema } from "src/utils/zod/valid_date";

type IParams = IMeeting & {
  _id: string;
}

const utils = new MeetingUtils();

const schemaA = z.object({
  _id: makeObjectIdSchema('_id'),
  createdAt: makeDateSchema('createdAt'),
  updatedAt: makeDateSchema('updatedAt')
});

export const schema = schemaA.extend(utils.zodSchema.shape);

export type IOutput = z.infer<typeof schema>;

export const validate = (params: IParams): ValidateParseResult => {
  return validateParse<IParams>(schema, params);
};
