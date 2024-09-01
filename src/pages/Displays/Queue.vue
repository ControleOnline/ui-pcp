<template>
  <q-page class="bg-grey">
    <div class="row full-height-vh">
      <div
        class="col-3 col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 q-pa-sm"
      >
        <q-card class="my-card full-height">
          <q-card-section>
            <div class="text-h6">Em Preparação</div>
            <div class="text-subtitle">Próximos pedidos</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(order, index) in orders.open" :key="index">
              <q-item-section avatar>
                <q-icon
                  :color="order.orderQueue[0].status.color"
                  :name="order.orderQueue[0].status.icon || 'local_hospital'"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>#{{ order.id }} </q-item-label>
                <q-item-label caption>{{ order.client.name }}</q-item-label>
                <q-item-label
                  :color="order.orderQueue[0].status.color"
                  caption
                  >{{
                    $t("status." + order.orderQueue[0].status.status)
                  }}</q-item-label
                >
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
            <div class="text-subtitle">Disponível para retirada</div>
          </div>
          <div
            class="col-9 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 q-pa-sm"
            v-for="(order, index) in orders.pending"
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
                      :color="order.orderQueue[0].status.color"
                      :name="
                        order.orderQueue[0].status.icon || 'local_hospital'
                      "
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{ order.client.name }}</q-item-label>
                    <q-item-label
                      :color="order.orderQueue[0].status.color"
                      caption
                      >{{
                        $t("status." + order.orderQueue[0].status.status)
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
        <div class="full-width q-pa-sm video-height">
          <q-video
            src="https://www.youtube.com/embed/YriZWDnixWE?rel=0&controls=0&autoplay=true"
            style="width: 100%px; height: 100%"
          />
        </div>
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
      isSearching: false,
      timeout: 60 * 1000,
      refresh: false,
      config: new Config(),
      orders: {
        display: null,
        open: [],
        pending: [],
      },
    };
  },

  created() {
    this.timeout =
      parseFloat(this.config.getConfig("refresh-display-time") || 60) * 1000;
    this.display = decodeURIComponent(this.$route.params.id);
    this.onRequest();
  },

  methods: {
    ...mapActions({
      getQueueOrders: "queues/getOrders",
    }),
    onRequest() {
      this.getMyOrders("open", 5);
      this.getMyOrders("pending", 3);
      //this.refresh = setInterval(() => {
      //  this.getMyOrders("open", 5);
      //  this.getMyOrders("pending", 3);
      //}, this.timeout);
    },

    getMyOrders(status, rows) {
      this.isSearching = true;
      return this.getQueueOrders({
        itemsPerPage: rows,
        "orderQueue.status.realStatus": status,
        "orderQueue.queue.displayQueue.display": this.display,
      })
        .then((result) => {
          this.orders[status] = result;
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
