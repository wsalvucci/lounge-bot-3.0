export enum TrialLineType {
    JuryVotedGulag,
    JuryVotedNoGulag,
    JuryVotedHung,
    BotAgreeGulag,
    BotOverrideGulag,
    BotHungGulag,
    BotAgreeNoGulag,
    BotOverrideNoGulag, 
    BotHungNoGulag,
    BotGulagHung,
    BotNoGulagHung,
    BotHungHung
}

export class TrialResultLine {
    id: number
    lineType: TrialLineType | undefined
    personalityId: number
    trialLine: string

    constructor(
        id: number,
        lineType: number,
        personalityId: number,
        trialLine: string
    ) {
        this.id = id
        this.lineType = lineTypeIdToType(lineType)
        this.personalityId = personalityId,
        this.trialLine = trialLine
    }

    static toDomainModel(data: any) : TrialResultLine {
        return new TrialResultLine(
            data.lineId,
            data.lineType,
            data.personalityId,
            data.trialLine
        )
    }
}

function lineTypeIdToType(id: number) {
    switch(id) {
        case 1: return TrialLineType.JuryVotedGulag
        case 2: return TrialLineType.JuryVotedNoGulag
        case 3: return TrialLineType.JuryVotedHung
        case 4: return TrialLineType.BotAgreeGulag
        case 5: return TrialLineType.BotOverrideGulag
        case 6: return TrialLineType.BotHungGulag
        case 7: return TrialLineType.BotAgreeNoGulag
        case 8: return TrialLineType.BotOverrideNoGulag
        case 9: return TrialLineType.BotHungNoGulag
        case 10: return TrialLineType.BotGulagHung
        case 11: return TrialLineType.BotNoGulagHung
        case 12: return TrialLineType.BotHungHung
    }
}