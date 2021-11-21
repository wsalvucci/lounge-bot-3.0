import gulagApi from "../../api/gulag/gulagApi";
import Gulag from "../../models/gulag/Gulag";

export default function getActiveGulagsUseCase(repository: typeof gulagApi) : Promise<Gulag[]> {
    return repository.getActiveGulags()
}