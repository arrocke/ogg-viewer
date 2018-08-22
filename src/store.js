import Vue from "vue";
import Vuex from "vuex";
import { readFile } from "@/util";
import OggReader from "@/ogg/reader";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    buffer: null,
    loaded: false,
    loading: false,
    reader: null
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
      state.reader = new OggReader({ buffer });
      window.reader = state.reader;
    }
  },
  actions: {
    async loadFile({ commit }, { file }) {
      commit("startLoad");
      let buffer = null;
      try {
        buffer = await readFile(file);
      } catch (e) {
        commit("endLoad", false);
        return;
      }
      commit("setBuffer", buffer);
      commit("endLoad", true);
    }
  }
});
