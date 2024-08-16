import type {Context, ServiceSchema} from "moleculer";
import ProductsService, {ProductEntity, ProductSettings, ProductsThis} from "./products.service";

export interface ActionCountParams {
	id: string;
}
export interface ActionQuantityParams {
	id: string;
	value: number;
}
const WarehouseService: ServiceSchema<ProductSettings> = {
	name: "warehouse",

	/**
	 * Mixins
	 */
	mixins: ProductsService.mixins,

	/**
	 * Settings
	 */
	settings: ProductsService.settings,

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Disable default "moleculer-db" mixin actions:
		 */
		list: false,
		find: false,
		count: false,
		create: false,
		insert: false,
		update: false,
		remove: false,
		get: false,

		// --- REQUIRED ACTIONS ---
		/**
		 * Get Product count against a given Product id
		 */
		productCount: {
			rest: "GET /product/:id/count",
			params: {
				id: "string",
			},
			async handler(this: ProductsThis, ctx: Context<ActionCountParams>): Promise<ProductEntity> {
				const {id} = ctx.params;
				const product: ProductEntity = <ProductEntity> await this.adapter.findById(id);
				if (!product) {
					throw new Error("Product not found");
				}

				return product;
			},
		},

		/**
		 * Decrease Product count on Product buy
		 */
		decreaseQuantity: {
			rest: "PUT /product/:id/quantity/decrease",
			params: {
				id: "string",
				value: "number|integer|positive",
			},
			async handler(this: ProductsThis, ctx: Context<ActionQuantityParams>): Promise<object> {
				const doc = await this.adapter.updateById(ctx.params.id, {
					$inc: { quantity: -ctx.params.value },
				});

				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			},
		},
	},

};

export default WarehouseService;
