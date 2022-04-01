import buttonApi from "../../api/button/buttonApi";
import ButtonRound from "../../models/button/ButtonRound";

export default function getRoundUseCase(guildId: string, repository: typeof buttonApi) : Promise<ButtonRound> {
    return repository.getRound(guildId)
}