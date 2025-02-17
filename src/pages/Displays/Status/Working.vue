<template>
  <div class="col-12 q-pa-sm" v-if="order">
    <q-card class="full-width">
      <q-card-section>
        <div class="text-subtitle">
          {{ $tt("display", "title", status_working.status) }}
        </div>
      </q-card-section>
      <q-separator />
      <q-list class="row">
        <q-item class="col">
          <q-card-section>
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
                    <q-badge :label="'x' + product.quantity" color="primary" />
                  </q-item-section>
                </q-item>
              </q-expansion-item>
            </q-list>
          </q-card-section>

          <q-list bordered separator>
            <div v-for="(group, groupId) in groups" :key="groupId">
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
        </q-item>

        <q-item :key="index" class="col-12 col-sm-4">
          <q-card class="q-mb-md full-width">
            <q-card-section>
              <q-item-label>
                {{ $tt("display", "label", "Order") }} #{{
                  order.order_product.order.id
                }}
              </q-item-label>
              <q-item-label>
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
            </q-card-section>
            <q-card-section>
              <q-item-label caption>
                {{ order.order_product.quantity }}
                {{ order.order_product.product.product }}(s)
              </q-item-label>
            </q-card-section>
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
    order: {
      requered: true,
    },
  },
  data() {
    return {
      groups: [],
    };
  },
  created() {
    if (!this.order) return;

    let filter = {
      order: this.order.order_product.order["@id"],
      parentProduct: this.order.order_product.product["@id"],
      orderProduct: this.order.order_product["@id"],
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

      this.groups = { ...grouped };
    });
  },
  methods: {
    ...mapActions({
      setOrderProductQueues: "order_products_queue/save",
      getOrderProducts: "product_orders/getItems",
    }),
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
