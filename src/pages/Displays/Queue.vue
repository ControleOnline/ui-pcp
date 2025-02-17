<template>
  <q-page class="bg-grey" v-if="loaded">
    <div class="row full-height-vh">
      <div
        class="col-3 col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 q-pa-sm"
      >
        <q-card class="my-card full-height">
          <q-card-section>
            <div class="text-subtitle">
              {{ $tt("display", "title", status_in.status) }}
            </div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(order, index) in orders['status_in']" :key="index">
              <q-item-section avatar>
                <q-icon
                  :color="order.status.color"
                  :name="order.status.icon || 'local_hospital'"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>#{{ order.id }} </q-item-label>
                <q-item-label caption>{{
                  order.order_product.product.product
                }}</q-item-label>
                <q-item-label :color="order.status.color" caption>{{
                  $t("status." + order.status.status)
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div
        class="col-9 col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 q-pa-sm"
      >
        <div class="row justify-center">
          <div class="col-12 justify-center text-center">
            <div class="text-subtitle">
              {{ $tt("display", "title", status_working.status) }}
            </div>
          </div>
          <div
            class="col-9 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 q-pa-sm"
            v-for="(order, index) in orders['status_working']"
            :key="index"
          >
            <q-card class="my-card">
              <q-card-section>
                <div class="text-h6 text-center">#{{ order.id }}</div>
              </q-card-section>

              <q-separator />
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      :color="order.status.color"
                      :name="order.status.icon || 'local_hospital'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{
                      order.order_product.product.product
                    }}</q-item-label>
                    <q-item-label :color="order.status.color" caption>{{
                      $t("status." + order.status.status)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
        <div class="full-width q-pa-sm video-height">Aqui</div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import Config from "@controleonline/ui-common/src/utils/config";

export default {
  data() {
    return {
      loaded: false,
      isSearching: false,
      config: new Config(),
      status_in: null,
      status_working: null,
      queues: [],
      orders: {
        display: null,
        status_in: [],
        status_working: [],
      },
    };
  },

  created() {
    this.display = decodeURIComponent(this.$route.params.id);
    this.onRequest();
  },

  methods: {
    ...mapActions({
      getOrderProductQueues: "order_products_queue/getItems",
      getQueuesFromDisplay: "display_queues/getItems",
    }),
    onRequest() {
      this.orders["status_in"] = [];
      this.orders["status_working"] = [];

      this.getQueuesFromDisplay({
        display: this.display,
      })
        .then((reult) => {
          reult.forEach((item, i) => {
            this.queues.push(item.queue.id);
            this.status_in = item.queue.status_in;
            this.status_working = item.queue.status_working;

            this.getMyOrders("status_in", item.queue.status_in.id, 3);
            this.getMyOrders("status_working", item.queue.status_working.id, 3);
          });
        })
        .finally(() => {
          this.loaded = true;
        });
    },

    getMyOrders(status, status_id, rows) {
      if (!this.queues) return;
      this.isSearching = true;
      return this.getOrderProductQueues({
        queue: this.queues,
        itemsPerPage: rows,
        status: status_id,
        //"exists[order_product.parentProduct]": "false",
      })
        .then((result) => {
          this.orders[status] = [...this.orders[status], ...result];
        })
        .finally(() => {
          this.isSearching = false;
        });
    },
  },
};
</script>

<style>
.full-height-vh {
  height: calc(100vh - 16px) !important;
}

.video-height {
  height: calc(100% - 130px) !important;
}
</style>
