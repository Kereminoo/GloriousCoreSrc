import { queryCmd, insertCmd, updateCmd } from "./lib/neDB";
import { DBNames } from "../app-files/dbFiles";
export class SocialDB {
    updateSocial(SocialId: any, SocialType: any, obj: any): Promise<any> {
        return updateCmd(DBNames.SocialDB, { SocialId, SocialType }, obj);
    }

    async getSocial(SocialId: any, SocialType: any): Promise<any> {
        const docs = await queryCmd(DBNames.SocialDB, { SocialId, SocialType });
        return docs[0];
    }

    getSocialType(SocialType: any): Promise<any> {
        return queryCmd(DBNames.SocialDB, { SocialType });
    }

    addSocial(obj: any): Promise<any> {
        return insertCmd(DBNames.SocialDB, obj);
    }
}
