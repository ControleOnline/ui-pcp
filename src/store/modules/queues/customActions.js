import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from "@controleonline/ui-default/src/error/SubmissionError";
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

      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error);
        return;
      }

      commit(types.SET_ERROR, e.message);
    });
}
