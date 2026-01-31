import _ from "lodash";

interface Props {
    defaultV: boolean;
    v?: boolean;
}

export const mapBoolean = ({ v, defaultV }: Props): boolean => _.isNil(v) ? defaultV : Boolean(v);
