import Vue from 'vue'
import App from './App.vue'
import Home from './Home.vue'
import Petitions from "./Petitions";
import PetitionDetail from "./PetitionDetail";
import PetitionCreation from './PetitionCreation.vue'
import MyPetitions from './MyPetitions.vue'
import PetitionEdit from './PetitionEdit.vue'
import Profile from './Profile.vue'


import VueRouter from 'vue-router';
import axios from 'axios';
import VueSocialSharing from 'vue-social-sharing'
import VueCookies from 'vue-cookies'

Vue.use(VueRouter);
Vue.prototype.$http = axios;
Vue.use(VueSocialSharing);
Vue.use(VueCookies);

// set default config
Vue.$cookies.config('7d')

// set global cookie
Vue.$cookies.set('theme','default');
Vue.$cookies.set('hover-time','1s');

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/petitions",
    component: Petitions
  },
  {
    path: "/petitions/:petitionId",
    component: PetitionDetail
  },
  {
    path: "/petition/creation",
    component: PetitionCreation
  },
  {
    path: "/myPetitions",
    component: MyPetitions
  },
  {
    path: "/petition/edit/:petitionId",
    component: PetitionEdit
  },
  {
    path: "/profile",
    component: Profile
  },

];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
