export default class SqlResponse {
    fieldCount: number
    affectedRows: number
    insertId: number
    info: string
    serverStatus: number
    warningStatus: number
    changedRows: number

    constructor(
        fieldCount: number,
        affectedRows: number,
        insertId: number,
        info: string,
        serverStatus: number,
        warningStatus: number,
        changedRows: number
        ) {
            this.fieldCount = fieldCount
            this.affectedRows = affectedRows
            this.insertId = insertId
            this.info = info
            this.serverStatus = serverStatus
            this.warningStatus = warningStatus
            this.changedRows = changedRows
        }

    static dataToModel(data: any) : SqlResponse {
        return new SqlResponse(
            data.fieldCount,
            data.affectedRows,
            data.insertId,
            data.info,
            data.serverStatus,
            data.warningStatus,
            data.changedRows
        )
    }
}