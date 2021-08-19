export default class SqlResponse {
    fieldCount?: number = undefined
    affectedRows?: number = undefined
    insertId?: number = undefined
    info?: string = undefined
    serverStatus?: number = undefined
    warningStatus?: number = undefined
    changedRows?: number = undefined
    code?: string = undefined
    errno?: number = undefined
    sqlState?: number = undefined
    sqlMessage?: string = undefined
    sql?: string = undefined

    constructor(
        fieldCount?: number,
        affectedRows?: number,
        insertId?: number,
        info?: string,
        serverStatus?: number,
        warningStatus?: number,
        changedRows?: number,
        code?: string,
        errno?: number,
        sqlState?: number,
        sqlMessage?: string,
        sql?: string
        ) {
            this.fieldCount = fieldCount
            this.affectedRows = affectedRows
            this.insertId = insertId
            this.info = info
            this.serverStatus = serverStatus
            this.warningStatus = warningStatus
            this.changedRows = changedRows
            this.code = code
            this.errno = errno
            this.sqlState = sqlState
            this.sqlMessage = sqlMessage
            this.sql = sql
        }

    static dataToModel(data: any) : SqlResponse {
        return new SqlResponse(
            data.fieldCount,
            data.affectedRows,
            data.insertId,
            data.info,
            data.serverStatus,
            data.warningStatus,
            data.changedRows,
            data.code,
            data.errno,
            data.sqlState,
            data.sqlMessage,
            data.sql
        )
    }
}