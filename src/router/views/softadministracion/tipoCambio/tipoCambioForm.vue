<template>
  <div class='col-lg-12'>
    <div class='card'>
      <div
        no-body
      >
         <form action="#" @submit.prevent="saveForm">
           <b-row class="mb-1">
            <b-col sm="6">
              <label>Moneda Origen</label>
              <b-form-select
                type="select"
                class="form-select input-sm"
                v-model="monedaOrigen"
                @change="validateCurrency()"
              >
                <option value="">
                  SELECCIONE::
                </option>
                <option
                  v-for="idt in optionsMonedaOrigen"
                  :key="idt.idMoneda"
                  :value="idt.idMoneda"
                >
                  {{ idt.descripcion }}
                </option>
              </b-form-select>
            </b-col>
            <b-col sm="6">
              <label>Moneda Destino</label>
              <b-form-select
                type="select"
                class="form-select input-sm"
                v-model="monedaDestino"
                @change="validateCurrency()"
              >
                <option value="">
                  SELECCIONE::
                </option>
                <option
                  v-for="idt in optionsMonedaDestino"
                  :key="idt.idMoneda"
                  :value="idt.idMoneda"
                >
                  {{ idt.descripcion }}
                </option>
              </b-form-select>
            </b-col>
          </b-row>
            <div class="row mb-2">
             <div class="col-sm-6">
              <label>Fecha</label>
                <input
                  type="date"
                  required="true"
                  class="form-control input-sm"
                  v-model="fecha"
                />
             </div>
             <div class='col-sm-6'>
                <label>Valor</label>
                <div>
                    <input
                    id="est_venta"
                    type="decimal"
                    required="true"
                    class="form-control"
                    v-model="formData.venta"
                    @keypress="validarDecimal($event, formData.venta)"
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
import moment from 'moment-timezone'
import { ref } from '@vue/composition-api'
import { useNotify } from '@/helpers/toast'
import { validDecimals } from '@/helpers'

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
    const monedaOrigen = ref('')
    const monedaDestino = ref('')
    const optionsMonedaOrigen = ref([])
    const optionsMonedaDestino = ref([])
    const fecha = ref(moment().format('YYYY-MM-DD'))
    const code = 'venta'

    const blankData = {
      descripcion: '',
      idTipoCambio: 0,
      venta: 0,
      compra: 0,
      monedaOrigen: {
        idMoneda: 0,
      },
      monedaDestino: {
        idMoneda: 0,
      },

    }
    const formData = ref(JSON.parse(JSON.stringify(blankData)))
    const parseDate = date => {
      const date1 = (!date || date === null) ? '' : moment(date).locale('es').format('YYYY-MM-DD')
      return date1
    }
    const parseDateSave2 = date => {
      const date1 = (!date || date === null) ? '' : moment.tz(moment(String(date)).format('YYYY-MM-DD[T]HH:mm:ss'), 'America/Lima')
      return date1
    }

    const validateCurrency = () => {
      if (monedaOrigen.value === monedaDestino.value){
        notify('Advertencia', 'Moneda de origen debe ser diferente a moneda destino', 'warning')
        monedaDestino.value = ''
      }
    }

    const dataForm = async () => {
      await store
        .dispatch('softadministracion/MONEDA_FIND_ALL', {
          limit: -1,
          query: '',
          page: -1,
          sortBy: 'idMoneda%7CDESC',
        })
        .then(response => {
          if (response !== undefined) {
            optionsMonedaOrigen.value = response 
          }
        })
        .catch(error => {
          notify('Ha ocurrido un error', error.response.data.message, 'danger')
        })
      await store
        .dispatch('softadministracion/MONEDA_FIND_ALL', {
          limit: -1,
          query: '',
          page: -1,
          sortBy: 'idMoneda%7CDESC',
        })
        .then(response => {
          if (response !== undefined) {
            optionsMonedaDestino.value = response 
          }
        })
        .catch(error => {
          notify('Ha ocurrido un error', error.response.data.message, 'danger')
        })
    }
    
    const getData = async () => {
      await dataForm()
      if (props.typeAction === 'edit') {
        formData.value = {
          idTipoCambio: props.dataEdit.idTipoCambio,
          descripcion: props.dataEdit.descripcion,
          venta: props.dataEdit.venta,
          compra: props.dataEdit.compra,
        }
        fecha.value = parseDate(props.dataEdit.fecha)
        monedaOrigen.value = props.dataEdit.monedaOrigen.idMoneda
        monedaDestino.value = props.dataEdit.monedaDestino.idMoneda
      }
    }
    getData()

    const saveForm = async () => {
      isBusy.value = true
      let bval = true
      if (bval && monedaOrigen.value === '') {
        notify('Advertencia', 'Seleccione una moneda de origen', 'warning')
        bval = false
        isBusy.value = false
      }
      if (bval && monedaDestino.value === '') {
        notify('Advertencia', 'Seleccione una moneda de destino', 'warning')
        bval = false
        isBusy.value = false
      }
      let service = 'softadministracion/TIPO_CAMBIO_CREATE'
      if (props.typeAction === 'edit') {
        service = 'softadministracion/TIPO_CAMBIO_UPDATE'
      }
      formData.value.fecha = parseDateSave2(fecha.value)
      formData.value.monedaOrigen = {
        idMoneda: monedaOrigen.value,
      }
      formData.value.monedaDestino = {
        idMoneda: monedaDestino.value,
      }
      if(bval) {
        await store.dispatch(service, formData.value)
          .then(() => {
            isBusy.value = false
            notify('Título', 'El proceso se ha ejecutado satisfactoriamente', 'success') 
            context.emit('refetch-data')
            context.emit('update:modal-show', false)
          })
          .catch(error => {
            isBusy.value = false
            notify(error, error.response.data.message, 'danger')
            // context.emit('error-data', error)
            // context.emit('update:is-add-new-user-sidebar-active', false)
          })
      }
    }
    

    return {
      saveForm,
      formData,
      isBusy,
      monedaDestino,
      code,
      monedaOrigen,
      optionsMonedaDestino,
      optionsMonedaOrigen,
      validateCurrency,
      fecha,
      parseDate,
      parseDateSave2
    }
  },
  methods: {
    hide() {
      this.$emit('update:modal-show', false)
    },
    validarDecimal($evt, value) {
      const texto = value
      console.log(texto)// eslint-disable-line
      const decimals = 2
      if ($evt.keyCode <= 13 || ($evt.keyCode >= 48 && $evt.keyCode <= 57)) {
        console.log('aaaa')// eslint-disable-line
        if(texto.length > 1) {
          const punto = texto.indexOf('.')
        if ((punto !== -1) && (texto.length - (punto + 1)) >= decimals) {
          $evt.preventDefault()
          return false
        }
        }
      } else if ($evt.keyCode === 46 && texto.length >= 1) {
        console.log('sddd')// eslint-disable-line
        const punto = texto.indexOf('.')
        if (punto !== -1 && texto.indexOf('.', punto) !== -1) {
          $evt.preventDefault()
          return false
        }
      } else {
        $evt.preventDefault()
            return false
      }
      return true
    },
    validBindType($event, control, decimals, bindType) {
      switch (bindType) {
        case 'decimal': validDecimals($event, control, decimals, this.$refs); break
        default: ''; break
      }
    },
    validDecimals,
  },
}
</script>