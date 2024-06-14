import { queryCmd, insertCmd, updateCmd, deleteCmd } from "./lib/neDB";
import { DBNames } from "../app-files/dbFiles";

export class EQDB {
    getEQ(): Promise<any> {
        return queryCmd(DBNames.EQDB, {});
    }

    insertEQ(obj: any): Promise<any> {
        return insertCmd(DBNames.EQDB, obj);
    }

    getEQById(value: any): Promise<any> {
        return queryCmd(DBNames.EQDB, { value });
    }

    updateEQ(value: any, obj: any): Promise<any> {
        return updateCmd(DBNames.EQDB, { value }, obj);
    }

    deleteEQ(value: any): Promise<any> {
        return deleteCmd(DBNames.EQDB, { value });
    }
}
