import botApi from "../../api/bot/botApi";
import ShopRole from "../../models/shop/ShopRole";

export default function getRoleShopUseCase(repository: typeof botApi) : Promise<ShopRole[]> {
    return repository.getRoleShop()
}