<template>
  <div class="col-12 q-pa-sm" v-if="groups">
    <q-card class="full-width">
      <q-card-section>
        <div class="text-subtitle">
          {{ $tt("display", "title", status_working.status) }}
        </div>
      </q-card-section>
      <q-separator />
      <q-list class="row">
        <q-item
          class="col-12 col-sm-4 col-md-3 col-lg-2 q-pa-sm"
          v-for="(order, index) in orders"
        >
          <q-card class="q-mb-md full-width">
            <q-card-section>
              <q-item-label>
                {{ $tt("display", "label", "Order") }} #{{
                  order.order_product.order.id
                }}</q-item-label
              ><q-item-label>
                {{ order.order_product.order.client.name }}
              </q-item-label>
              <q-item-label caption>
                <q-icon
                  v-if="order.status.icon"
                  :color="order.status.color"
                  :name="order.status.icon"
                  class="q-mr-sm"
                />
                {{ $tt("display", "label", order.status.status) }}
              </q-item-label>
              <q-item-label>
                {{ order.order_product.quantity }}
                {{ order.order_product.product.product }}(s)
              </q-item-label>
            </q-card-section>
            <q-card-section>
              <q-list bordered separator>
                <q-expansion-item
                  v-for="(products, groupId) in products"
                  :key="groupId"
                  expand-separator
                  :label="products[0].productGroup.productGroup"
                >
                  <q-item v-for="product in products" :key="product.id">
                    <q-item-section>
                      <q-item-label>{{ product.product.product }}</q-item-label>
                      <q-item-label caption
                        >Preço: R$ {{ product.price }}</q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-badge
                        :label="'x' + product.quantity"
                        color="primary"
                      />
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-list>
            </q-card-section>

            <q-list bordered separator>
              <div v-for="(group, groupId) in groups[index]" :key="groupId">
                <span>{{ group.productGroup }}</span>
                <q-item v-for="product in group.products" :key="product.id">
                  <q-item-section side>
                    <q-badge :label="'x' + product.quantity" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ product.product.product }}</q-item-label>
                    <q-item-label caption
                      >Preço: R$ {{ product.price }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </div>
            </q-list>

            <q-card-actions v-if="status_out">
              <q-btn
                class="full-width"
                color="primary"
                :label="$tt('display', 'btn', 'Finalize')"
                @click="finalize(order)"
              />
            </q-card-actions>
          </q-card>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    status_working: {
      default: null,
    },
    status_out: {
      default: null,
    },
    orders: {
      requered: true,
    },
  },
  data() {
    return {
      groups: [],
    };
  },
  created() {
    this.getProducts();
  },
  methods: {
    ...mapActions({
      setOrderProductQueues: "order_products_queue/save",
      getOrderProducts: "product_orders/getItems",
    }),
    getProducts() {
      console.log(this.orders);
      if (!this.orders) return;
      let groups = [];
      this.orders.forEach((order, i) => {
        let filter = {
          order: order.order_product.order["@id"],
          parentProduct: order.order_product.product["@id"],
          orderProduct: order.order_product["@id"],
        };

        this.getOrderProducts(filter).then((products) => {
          let grouped = products.reduce((acc, product) => {
            if (!product.productGroup) return acc;
            const groupId = product.productGroup.id;
            if (!acc[groupId]) acc[groupId] = product.productGroup;
            if (!acc[groupId]["products"]) acc[groupId]["products"] = [];
            acc[groupId]["products"].push(product);
            return acc;
          }, {});

          groups[i] = grouped;
        });
      });
      if (groups.length == this.orders.length) this.groups = groups;
    },

    finalize(order) {
      this.setOrderProductQueues({
        id: order.id,
        status: this.status_out["@id"],
      }).finally(() => {
        this.$emit("reload");
      });
    },
  },
};
</script>
