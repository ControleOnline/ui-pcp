<template>
  <q-page>
    <div class="row full-height-vh">
      <InOut
        v-if="loaded['status_in']"
        :orders="orders['status_in']"
        :status_in="status_in"
        :status_working="status_working"
        @reload="onRequest"
      />
      <Working
        v-if="loaded['status_working']"
        :orders="orders['status_working']"
        :status_working="status_working"
        :status_out="status_out"
        @reload="onRequest"
      />
      <InOut
        v-if="loaded['status_out']"
        :orders="orders['status_out']"
        :status_in="status_out"
        @reload="onRequest"
      />
    </div>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import InOut from "./Status/InOut.vue";
import Working from "./Status/Working.vue";

import Config from "@controleonline/ui-common/src/utils/config";

export default {
  components: {
    InOut,
    Working,
  },
  data() {
    return {
      loaded: [],
      config: new Config(),
      status_in: null,
      status_working: null,
      status_out: null,
      queues: [],
      orders: {
        display: null,
        status_in: [],
        status_working: [],
        status_out: [],
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
      this.orders["status_out"] = [];

      this.getQueuesFromDisplay({
        display: this.display,
      }).then((reult) => {
        reult.forEach((item, i) => {
          this.queues.push(item.queue.id);
          this.status_in = item.queue.status_in;
          this.status_working = item.queue.status_working;
          this.status_out = item.queue.status_out;

          this.getMyOrders("status_in", item.queue.status_in.id, 6);
          this.getMyOrders("status_working", item.queue.status_working.id, 6);
          this.getMyOrders("status_out", item.queue.status_out.id, 6);
        });
      });
    },

    async getMyOrders(status, status_id, rows) {
      if (!this.queues) return;

      return await this.getOrderProductQueues({
        queue: this.queues,
        itemsPerPage: rows,
        status: status_id,
        //"exists[order_product.parentProduct]": "false",
      })
        .then((result) => {
          this.orders[status] = [...this.orders[status], ...result];
        })
        .finally(() => {
          this.loaded[status] = true;
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
