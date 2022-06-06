<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <form action="#" @submit.prevent="saveForm">
          <b-row class="mb-2">
            <b-col sm="5">
              <label>Documento</label>
              <b-input-group>
                <input
                  type="text"
                  name="minlen"
                  required="true"
                  class="form-control"
                  v-model="formData.dni"
                >
                <b-input-group-append>
                  <b-button
                    variant="warning"
                  >
                    <i class="bx bx-search-alt-2"></i>
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-col>
            <b-col sm="7">
              <div
                v-if="isBusyReniec"
                class="text-center text-primary my-2"
              >
                <b-spinner
                  variant="primary"
                  class="align-middle"
                />
                <strong class="ml-1">Cargando...</strong>
              </div>
              <label>Nombre</label>
              <div>
                <input
                  type="text"
                  name="name"
                  required="true"
                  class="form-control"
                  v-model="formData.nombre"
                >
              </div>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="5">
              <label>Apellido Paterno</label>
              <div>
                <input
                  type="text"
                  name="paternalSurname"
                  required="true"
                  class="form-control"
                  v-model="formData.apellidoPaterno"
                >
              </div>
            </b-col>
            <b-col sm="7">
              <label>Apellido Materno</label>
              <div>
                <input
                  type="text"
                  name="email"
                  required="true"
                  class="form-control"
                  v-model="formData.apellidoMaterno"
                >
              </div>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="5">
              <label>Usuario</label>
              <div>
                <input
                  type="text"
                  name="usuario"
                  required="true"
                  class="form-control"
                  v-model="formData.login"
                >
              </div>
            </b-col>
            <b-col sm="7">
              <label>Correo</label>
              <div>
                <input
                  type="text"
                  name="email"
                  required="true"
                  class="form-control"
                  v-model="formData.email"
                >
              </div>
            </b-col>
          </b-row>
          <b-row
            v-if="typeAction!=='edit'"
            class="mb-2"
          >
            <b-col sm="5">
              <label>Contraseña</label>
              <div>
                <input
                  type="password"
                  name="email"
                  required="true"
                  class="form-control"
                  v-model="formData.password"
                >
              </div>
            </b-col>
            <b-col sm="5">
              <label>Perfil</label>
              <b-form-select
                type="select"
                class="form-select input-sm"
                v-model="perfil"
              >
                <option value="">
                  SELECCIONE::
                </option>
                <option
                  v-for="idt in optionsPerfil"
                  :key="idt.idPerfil"
                  :value="idt.idPerfil"
                >
                  {{ idt.descripcion }}
                </option>
              </b-form-select>
            </b-col>
          </b-row>
          <br>
          <div class="text-center mt-2">
            <b-button
                variant="primary"
                class="mr-2"
                type="submit"
                :disabled="isBusy"
            >
                Guardar
            </b-button>
            <b-button
                type="button"
                variant="outline-secondary"
                style="margin-left:4%"
                @click="hide"
            >
                Cancelar
            </b-button>
          </div>
        </form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import store from '@/state/store'
import {
  BRow, BCol, BCard, BInputGroup, BInputGroupAppend, BButton, BSpinner,
} from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import { useNotify } from '@/helpers/toast'
import { required } from "vuelidate/lib/validators"

export default {
  emits: ['update:is-busy-form', 'update:modal-show', 'update:data-edit'],
  props: {
    typeAction: {
      type: String,
      required: true,
    },
    dataEdit: {
      type: Object,
      required: false,
      default: null,
    },
  },
  components: {
    BRow,
    BCol,
    BCard,
    BInputGroup,
    BInputGroupAppend,
    BButton,
    BSpinner,
  },
  validations: {
    saveForm: {
      dni: { required },
      username: { required },
    },
  },
  setup(props, context) {
    const { notify } = useNotify(context)
    const isBusy = ref(false)
    const isBusyReniec = ref(false)
    const optionsPerfil = ref([])
    const perfil = ref('')
    const blankData = {
      idUsuario: 0,
      dni: '',
      name: '',
      login: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      email: '',
      estado: true,
    }
    
    const formData = ref(JSON.parse(JSON.stringify(blankData)))

    const dataForm = async () => {
      await store
        .dispatch('softseguridad/PROFILE_FIND_ALL', {
          limit: -1,
          query: '',
          page: -1,
          sortBy: 'idPerfil%7CDESC',
        })
        .then(response => {
          if (response !== undefined) {
            optionsPerfil.value = response 
          }
        })
        .catch(error => {
          notify('Ha ocurrido un error', error.response.data.message, 'danger')
        })
    }

    const dataGet = async () => {
      await dataForm()
      if (props.typeAction === 'edit') {
        formData.value = {
          idUsuario: props.dataEdit.idUsuario,
          dni: props.dataEdit.dni,
          nombre: props.dataEdit.nombre,
          apellidoPaterno: props.dataEdit.apellidoPaterno,
          apellidoMaterno: props.dataEdit.apellidoMaterno,
          login: props.dataEdit.login,
          email: props.dataEdit.email,
          estado: props.dataEdit.estado,
        }    
      }
      console.log(formData.value)// eslint-disable-line
    }

    dataGet()

    const hide = () => {
      context.emit('update:modal-show', false)
    }
    const saveForm = async () => {
      isBusy.value = true
      let service = 'softseguridad/USER_CREATE'
      if (props.typeAction === 'edit') {
        service = 'softseguridad/USER_UPDATE'
      }
      store.dispatch(service, formData.value)
        .then(()=> {
          isBusy.value = false
          notify('Título', 'El proceso se ha ejecutado satisfactoriamente', 'success') 
          context.emit('refetch-data')
          context.emit('update:modal-show', false)
        })
        .catch(error => {
          isBusy.value = false
          notify('error', error.response.data.message, 'danger')
        })
    }

    return {
      hide,
      saveForm,
      isBusy,
      formData,
      isBusyReniec,
      perfil,
      optionsPerfil,
    }
  }
}

</script>