import type { Context, Service, ServiceSchema } from "moleculer";
import type { DbAdapter, DbServiceSettings, MoleculerDbMethods } from "moleculer-db";
import type MongoDbAdapter from "moleculer-db-adapter-mongo";
import type { DbServiceMethods } from "../mixins/db.mixin";
import DbMixin from "../mixins/db.mixin";

export interface ProductEntity {
	_id: string;
	name: string;
	price: number;
	quantity: number;
}

export type ActionCreateParams = Partial<ProductEntity>;

export interface ActionBuyParams {
	id: string;
}

export interface ProductSettings extends DbServiceSettings {
	indexes?: Record<string, number>[];
}

export interface ProductsThis extends Service<ProductSettings>, MoleculerDbMethods {
	adapter: DbAdapter | MongoDbAdapter;
}

const ProductsService: ServiceSchema<ProductSettings> & { methods: DbServiceMethods } = {
	name: "products",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("products")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["_id", "name", "quantity", "price"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive",
		},

		indexes: [{ name: 1 }],
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 */
			create(ctx: Context<ActionCreateParams>) {
				ctx.params.quantity = 0;
			},
		},
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- REQUIRED ACTIONS ---
		/**
		 * Get Available Products
		 */
		availableProducts: {
			rest: "GET /instock",
			async handler(this: ProductsThis): Promise<object[]> {
				return await this.adapter.find({query: {quantity: {$gt: 0}}});
			},
		},

		/**
		 * Buy a Product
		 */
		buyProduct: {
			rest: "POST /:id/buy",
			params: {
				id: "string",
			},
			async handler(this: ProductsThis, ctx: Context<ActionBuyParams>): Promise<string> {
				const {id} = ctx.params;
				const product: ProductEntity = <ProductEntity>await this.adapter.findById(id);
				if (!product) {
					throw new Error("Product not found");
				}

				// Decrease product count in the warehouse
				await ctx.call("warehouse.decreaseQuantity", {id, value: 1});

				return "Successfully bought " + product.name + " at price of " + product.price;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB(this: ProductsThis) {
			await this.adapter.insertMany([
				{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
				{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
				{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
			]);
		},
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected(this: ProductsThis) {
		if ("collection" in this.adapter) {
			if (this.settings.indexes) {
				await Promise.all(
					this.settings.indexes.map((index) =>
						(<MongoDbAdapter>this.adapter).collection.createIndex(index),
					),
				);
			}
		}
	},
};

export default ProductsService;
