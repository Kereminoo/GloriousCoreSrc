import { queryCmd, insertCmd, updateCmd, deleteCmd } from "./lib/neDB";
import { DBNames } from "../app-files/dbFiles";

export class MacroDB {
    getMacro(): Promise<any> {
        return queryCmd(DBNames.MacroDB, {});
    }

    insertMacro(obj: any): Promise<any> {
        return insertCmd(DBNames.MacroDB, obj);
    }

    getMacroById(value: any): Promise<any> {
        return queryCmd(DBNames.MacroDB, { value });
    }

    updateMacro(value: any, obj: any): Promise<any> {
        return updateCmd(DBNames.MacroDB, { value }, obj);
    }

    deleteMacro(value: any): Promise<any> {
        return deleteCmd(DBNames.MacroDB, { value });
    }
}
