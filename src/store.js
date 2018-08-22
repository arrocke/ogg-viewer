import Vue from "vue";
import Vuex from "vuex";
import { readFile } from "@/util";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    buffer: null,
    loaded: false,
    loading: false
  },
  mutations: {
    startLoad(state) {
      state.loading = true;
    },
    endLoad(state, loaded) {
      state.loading = false;
      state.loaded = loaded;
    },
    setBuffer(state, buffer) {
      state.buffer = buffer;
    }
  },
  actions: {
    async loadFile({ commit }, { file }) {
      commit("startLoad");
      try {
        const buffer = await readFile(file);
        commit("setBuffer", buffer);
        commit("endLoad", true);
      } catch (e) {
        commit("endLoad", false);
      }
    }
  }
});
