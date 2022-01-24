import botApi from "../../api/bot/botApi";
import ShopRole from "../../models/shop/ShopRole";

export default function getShopRoleInfoUseCase(roleId: string, repository: typeof botApi) : Promise<ShopRole> {
    return repository.getShopRoleInfo(roleId)
}