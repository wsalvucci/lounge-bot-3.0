class Gulag {
    victimId: string
    attackerId: string
    timestamp: number
    points: number
    active: number

    constructor(
        victimId: string,
        attackerId: string,
        timestamp: number,
        points: number,
        active: number
    ) {
        this.victimId = victimId
        this.attackerId = attackerId
        this.timestamp = timestamp
        this.points = points
        this.active = active
    }

    static toDomainModel(data: any) : Gulag {
        return new Gulag(
            data.victimId,
            data.attackerId,
            data.timestamp,
            data.points,
            data.active
        )
    }
}

export default Gulag