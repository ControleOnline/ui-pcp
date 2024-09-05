import { api } from "@controleonline/../../src/boot/api";
import * as types from "@controleonline/ui-default/src/store/default/mutation_types";

const RESOURCE_ENDPOINT = "/sales/orders";

export function getOrders({ commit }, data) {
  commit(types.SET_ISLOADING);

  const options = {
    method: "GET",
    params: data || {},
  };

  return api
    .fetch(RESOURCE_ENDPOINT, options)

    .then((data) => {
      commit(types.SET_ISLOADING, false);

      return data["hydra:member"] || null;
    })
    .catch((e) => {
      commit(types.SET_ISLOADING, false);
      commit(types.SET_ERROR, e.message);
      throw e;
    });
}
