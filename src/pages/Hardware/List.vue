<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    DefaultTable,
  },
  computed: {
    ...mapGetters({

    }),
    configs() {
      return {
        store: 'displays',
        add: true,
        selection: false,
        search: {
        },
      };
    }
  },
  data() {
    return {



    };
  },
  created() {
  },
  methods: {
  },
};
</script>