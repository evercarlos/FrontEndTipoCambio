<template>
  <Layout class="bg-sofsalud">
    <b-modal
      v-model="modalShow"
      size="md"
      :title="titleModal"
      ok-title="Guardar"
      cancel-variant="outline-secondary"
      no-close-on-backdrop
      no-close-on-esc
      :busy="isBusyModal"
      :hide-footer="true"
    >
      <b-overlay
        :show="isBusyModal"
        rounded="sm"
      >
        <profile-select
          ref="refProfileSelect"
          :is-busy-form.sync="isBusyModal"
          :modal-show.sync="modalShow"
          :data-edit="dataForm"
          @refetch-data="refetchData"
          @error-data="showError"
        />
      </b-overlay>
    </b-modal>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-5 mt-4">
        <div class="card overflow-hidden account-pages my-5 pt-0">
          <div class="bg-soft bg-primary">
            <div class="row">
              <div class="col-12 align-self-end">
                <img
                  src="@/assets/images/softsalud/cambio2.png"
                  alt
                  class="img-fluid"
                  style="width:100%"
                />
              </div>
            </div>
          </div>
          <div class="card-body pt-0">
            <div>
              <router-link to="/">
                <div class="avatar-md profile-user-wid mb-4">
                  <span class="avatar-title rounded-circle bg-light">
                    <img src="@/assets/images/softsalud/cambio.png" alt height="34" />
                  </span>
                </div>
              </router-link>
              <div style="margin-top:-3.75%">
                <h4 style="font-weight: bold; text-align:center">Ingrese sus Credenciales</h4>
              </div>
            </div>
            <b-alert
              v-model="isAuthError"
              variant="danger"
              class="mt-3"
              dismissible
              >{{ authError }}</b-alert
            >
            <div
              v-if="notification.message"
              :class="'alert ' + notification.type"
            >
              {{ notification.message }}
            </div>
            <b-form class="p-2" @submit.prevent="tryToLogIn">
              <b-form-group
                class="mb-3"
                id="input-group-1"
                label="Usuario"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="text"
                  placeholder="Ingrese su Usuario"
                  :class="{ 'is-invalid': submitted && $v.email.$error }"
                ></b-form-input>
                <div
                  v-if="submitted && $v.email.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.email.required">Email is required.</span>
                </div>
              </b-form-group>

              <b-form-group
                class="mb-3"
                id="input-group-2"
                label="Contraseña"
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  :class="{ 'is-invalid': submitted && $v.password.$error }"
                ></b-form-input>
                <div
                  v-if="submitted && !$v.password.required"
                  class="invalid-feedback"
                >
                  Password is required.
                </div>
              </b-form-group>
              <b-form-checkbox
                  class="form-check"
                  id="customControlInline"
                  name="checkbox-1"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  Remember me
                </b-form-checkbox>
              <div class="mt-3 d-grid">
                  <div
                    v-if="isBusy"
                    class="text-center text-primary my-2"
                  >
                    <b-spinner
                      variant="primary"
                      class="align-middle"
                    />
                    <strong class="ml-1">Cargando...</strong>
                  </div>
                <b-button type="submit" variant="primary" class="btn-block"
                  >Ingresar</b-button
                >
              </div>
            </b-form>
          </div>
          <!-- end card-body -->
        </div>
        <br>
        <br>
        <!-- end card -->
        <!-- end row -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>
<script>
// import axios from "axios";

import Layout from "../layouts/auth";
import {
  authMethods,
  authFackMethods,
  notificationMethods,
} from "@/state/helpers";
import { mapState } from "vuex";
import {
  BSpinner
} from 'bootstrap-vue'
import appConfig from "@/app.config";
import { required } from "vuelidate/lib/validators";
import ProfileSelect from './ProfileSelect'

/**
 * Login component
 */
export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    BSpinner,
    ProfileSelect,
  },
  data() {
    return {
      email: '',
      password: '',
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      isBusy: false,
      modalShow: false,
      titleModal: 'Lista de Perfiles',
      dataForm: {},
      isBusyModal: false,
      dataResponse: {}
    };
  },
  validations: {
    email: {
      required,
    },
    password: {
      required,
    },
  },
  computed: {
    ...mapState("authfack", ["status"]),
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    ...authMethods,
    ...authFackMethods,
    ...notificationMethods,
    // Try to log the user in with the username
    // and password they provided.
    // okMdl()
    async refetchData(idProfile) {
      localStorage.setItem('user', JSON.stringify(this.dataResponse.user))
      localStorage.setItem('user-token', this.dataResponse.token);
      localStorage.setItem('token-type', this.dataResponse.tokenType)
      localStorage.setItem('profile', idProfile)
      let menu = [
        {
          id: 1,
          description: "SYS TIPO CAMBIO",
          menus:[
            {
              id: 1,
              description: "ADMINISTRACIÓN",
              icon: "bx bx-cog",
              subMenus: [
                {
                  url: "/moneda",
                  description: "Moneda",

                },
                {
                  url: "/tipo_cambio",
                  description: "Tipo Cambio"
                },
                {
                  url: "/conversion",
                  description: "Conversión"
                }
              ]
            },
            {
              id: 2,
              description: "SEGURIDAD",
              icon: "bx bx-lock-alt",
              subMenus: [
                {
                  url: "/perfil",
                  description: "Perfil",

                },
                {
                  url: "/usuario",
                  description: "Usuario"
                },
              ]
            },
          ]
        }
      ]
      localStorage.setItem('menu',JSON.stringify(menu));
      this.login({
        email: 'admin@themesbrand.com',
        password: '123456',
      })
    },
    showError() {
      console.log('dd')// eslint-disable-line
    },
    async tryToLogIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
      this.isBusy = true
      const { email, password } = this;
      await this.$store
        .dispatch('softseguridad/AUTH_CREATE_TOKEN', {
          username: email,
          password,
        })
        .then( async response => {
           if (response.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.dataResponse = response
               await this.refetchData(response.sistemas[0].perfil)
            }
          this.isBusy = false
        })
        .catch(error => {
          this.isBusy = false
          this.$toast.error(error.response.data.message, {
            position: "top-right",
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: "button",
            icon: true,
            rtl: false
          });
        })
      }
    },
  },
  mounted() {},
};
</script>
<style lang="scss">
.bg-sofsalud{
  background-image: url('~@/assets/images/softsalud/fondo6.jpg');// bg-palmas - copia.jpg
  background-repeat: no-repeat;
  background-position: bottom center;
  /*background-size: 100%*/
  height: 100vh;
}
</style>