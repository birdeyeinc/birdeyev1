
import { MODULE_NAMES } from "components/RailNav/constants";
const { ENT_REPORT } = MODULE_NAMES;

export const createNewPathName = (moduleName: string) => {
    if (moduleName === ENT_REPORT) {
        return "/dashboard/analytics-dash/create";
    }
};