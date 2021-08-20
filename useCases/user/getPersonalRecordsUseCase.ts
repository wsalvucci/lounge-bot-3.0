import Repository from '../../api/loungeApi'
import { PersonalRecordsResponse } from '../../models/response/PersonalRecordsResponse'

export function getPersonalRecordsUseCase(discordId: string, repository: typeof Repository) : Promise<PersonalRecordsResponse> {
    return repository.getPersonalRecords(discordId)
}