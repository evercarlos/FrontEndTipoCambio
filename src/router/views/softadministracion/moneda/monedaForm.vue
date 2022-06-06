<template>
  <div class='col-lg-12'>
    <div class='card'>
      <div
        no-body
      >
         <form action="#" @submit.prevent="saveForm">
           <div class="row mb-2">
             <div class='col-sm-12'>
                <label>Descripción</label>
                <div>
                    <input
                    type="text"
                    name="minlen"
                    required="true"
                    class="form-control"
                    v-model="formData.descripcion"
                    />
                </div>
             </div>
            </div>
            <div class="row mb-2">
             <div class='col-sm-12'>
                <label>Icono</label>
                <div>
                    <input
                    type="text"
                    name="minlen"
                    required="true"
                    class="form-control"
                    v-model="formData.icono"
                    />
                </div>
             </div>
            </div>
            <br>
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
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/state/store'
import {
  BButton,
} from 'bootstrap-vue'
import {
  required,
} from "vuelidate/lib/validators"
import { ref } from '@vue/composition-api'
import { useNotify } from '@/helpers/toast'

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
    BButton,
  },
  data() {
    return {
    }
  },
  validations: {
    saveForm: {
      descripcion: { required },
    },
  },
  setup(props, context) {
    const { notify } = useNotify(context)
    const isBusy = ref(false)

    const blankData = {
      descripcion: '',
      icono: '',
      idMoneda: 0,
    }
    const formData = ref(JSON.parse(JSON.stringify(blankData)))
    
    if (props.typeAction === 'edit') {
      formData.value = {
        idMoneda: props.dataEdit.idMoneda,
        descripcion: props.dataEdit.descripcion,
        icono: props.dataEdit.icono,
      }
    }

    const saveForm = async () => {
      isBusy.value = true
      let service = 'softadministracion/MONEDA_CREATE'
      if (props.typeAction === 'edit') {
        service = 'softadministracion/MONEDA_UPDATE'
      }
      store.dispatch(service, formData.value)
        .then(() => {
          isBusy.value = false
          notify('Título', 'El proceso se ha ejecutado satisfactoriamente', 'success') 
          context.emit('refetch-data')
          context.emit('update:modal-show', false)
        })
        .catch(error => {
          isBusy.value = false
          // notify(error, error.response.data.message, 'danger')
          context.emit('error-data', error)
          // context.emit('update:is-add-new-user-sidebar-active', false)
        })
    }

    return {
      saveForm,
      formData,
      isBusy,
    }
  },
  methods: {
    hide() {
      this.$emit('update:modal-show', false)
    }
  },
}
</script>