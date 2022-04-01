export default class UserButton {
    userId: string
    timePressed: number
    actionTaken: number
    buttonBroken: number
    score: number

    constructor(
        userId: string,
        timePressed: number,
        actionTaken: number,
        buttonBroken: number,
        score: number
    ) {
        this.userId = userId
        this.timePressed = timePressed
        this.actionTaken = actionTaken
        this.buttonBroken = buttonBroken
        this.score = score
    }

    static toDomainModel(data: any) : UserButton {
        return new UserButton(
            data.userId,
            data.timePressed,
            data.actionTaken,
            data.buttonBroken,
            data.score
        )
    }
}