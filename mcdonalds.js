/////////////////////////////////////////
//  MCDONALD
/////////////////////////////////////////


class McDonald {

    static async getStoreList() {
        let stores  = [];
        let page    = 0;

        //  UTIL

        function getStorePage(page) {
            return fetch(`https://api.woosmap.com/stores?page=${page}&key=woos-77bec2e5-8f40-35ba-b483-67df0d5401be`, {
                headers: {
                    Origin: "https://www.restaurants.mcdonalds.fr"
                }
            })
                .then(res => res.json())
        }

        //  GETTER

        while (true) {
            let res = await getStorePage(++page);

            // Push stores.
            stores.push(...res.features);

            // Check final page.
            if (page == res.pagination.pageCount)
                break;
        }

        return stores;
    }

    static getProductList() {
        return fetch(`https://ws.mcdonalds.fr/api/catalog/gomcdo?eatType=TAKE_OUT&responseGroups=RG.CATEGORY.PICTURES&responseGroups=RG.CATEGORY.POPINS&responseGroups=RG.PRODUCT.PICTURES&responseGroups=RG.PRODUCT.CHOICE_FINISHED_DETAILS&responseGroups=RG.PRODUCT.RESTAURANT_STATUS&responseGroups=RG.PRODUCT.INGREDIENTS&responseGroups=RG.PRODUCT.POPINS&responseGroups=RG.PRODUCT.CAPPING`)
            .then(res => res.json());
    }

    static getProductDetails(ref) {
        return fetch(`https://ws.mcdonalds.fr/api/product/${ref}?responseGroups=RG.PRODUCT.CHOICE_DETAILS&responseGroups=RG.PRODUCT.RESTAURANT_STATUS&responseGroups=RG.PRODUCT.DEFAULT&responseGroups=RG.PRODUCT.PICTURES&responseGroups=RG.PRODUCT.ALLERGENS&responseGroups=RG.PRODUCT.INGREDIENTS&responseGroups=RG.PRODUCT.NUTRITIONAL_VALUES&responseGroups=RG.PRODUCT.POPINS&responseGroups=RG.PRODUCT.CAPPING`)
            .then(res => res.json());
    }
}
