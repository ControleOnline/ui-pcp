import * as actions from "@controleonline/ui-default/src/store/default/actions";
import * as getters from "@controleonline/ui-default/src/store/default/getters";
import mutations from "@controleonline/ui-default/src/store/default/mutations";

export default {
  namespaced: true,
  state: {
 item:{},
items:[],
filters:{},
    resourceEndpoint: "display_queues",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    columns: []
  },
  actions,
  getters,
  mutations,
};
