import { createApp } from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import { apiCall } from "./methods";

const store = new Vuex.Store({
  state: {
    userIsLoged: false,
    showModal: false,
    dataTrackers: [],
    user: {
      id: null,
      name: null,
      email: null,
      password: null
    },
    actionType: {
      LOGIN_TYPE: {
        id: 0,
        title: 'входа'
      },
      JOIN_TYPE: {
        id: 1,
        title: 'регистрации'
      },
      LOGOUT_TYPE: {
        id: 2,
        title: 'выхода'
      },
    }
  },

  actions: {
    getAuthorizedUser: function ({ commit }) {
      const dateLoged = localStorage.dateLogin;
      if (dateLoged) {
        const dateNow = Date.now();
        const oneDayInMS = 8.64e7; // 24 часа

        if (dateNow - dateLoged > oneDayInMS) {
          localStorage.removeItem('userLogin');
          localStorage.removeItem('dateLogin');
          return;
        }

        const userNameLoged = localStorage.userLogin;

        apiCall(
          'http://localhost:8000/user/authorized',
          { method:'post', body: { userName: userNameLoged } },
          function (response) {
            if(response.result) {
              commit('set', { user: response.user });
              commit('set', { userIsLoged: true });
            }
          }
        );
      }
    },

    openModal: function ({ commit }) {
      commit('set', { showModal: true });
    },

    closeModal: function ({ commit }) {
      commit('set', { showModal: false });
    }
  },

  mutations: {
    set(state, data) {
      Object.entries(data).forEach(([key, value]) => {
        state[key] = value;
      })
    }
  }
})

createApp(App).use(Vuex);
createApp(App).use(store).mount('#app');
