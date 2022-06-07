<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <form action="#" @submit.prevent="saveForm">
          <b-row class="mb-2">
            <div class="col-sm-4">
              <label>Fecha</label>
                <input
                  type="date"
                  required="true"
                  class="form-control input-sm"
                  v-model="fecha"
                  @change="selectDate()"
                />
             </div>
            <b-col sm="8">
              <label>Tipo Cambio</label>
              <b-form-select
                type="select"
                class="form-select input-sm"
                v-model="tipoCambio"
                @change="seleccionarTipoCambio()"
              >
                <option value="">
                  SELECCIONE::
                </option>
                <option
                  v-for="idt in optionsTipoCambio"
                  :key="idt.idTipoCambio"
                  :value="idt.idTipoCambio"
                >
                  {{ idt.descripcion }}
                </option>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="4">
              <label>Valor Cambio</label>
              <div>
                <input
                  type="text"
                  name="usuario"
                  required="true"
                  class="form-control"
                  disabled
                  v-model="venta"
                >
              </div>
            </b-col>
            <b-col sm="4">
              <label>Monto</label>
              <div>
                <input
                  type="text"
                  required="true"
                  class="form-control"
                  v-model="monto"
                  @keyup="seleccionarTipoCambio()"
                  @keypress="validarDecimal($event, monto)"
                >
              </div>
            </b-col>
            <b-col sm="4">
              <label>Monto Convertido</label>
              <div>
                <input
                  type="text"
                  name="email"
                  required="true"
                  class="form-control"
                  disabled
                  v-model="montoConvertido"
                >
              </div>
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
  BRow, BCol, BCard, BButton,
} from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import { useNotify } from '@/helpers/toast'
import moment from 'moment-timezone'
import { _ } from 'vue-underscore'
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
    BButton,
  },
  validations: {
    saveForm: {
      monto: { required },
      montoConvertido: { required },
      tipoCambio: { required },
    },
  },
  setup(props, context) {
    const { notify } = useNotify(context)
    const isBusy = ref(false)
    const isBusyReniec = ref(false)
    const optionsTipoCambio = ref([])
    const tipoCambio = ref('')
    const fecha = ref(moment().locale('es').format('YYYY-MM-DD'))
    const venta = ref(0)
    const monto = ref(0)
    const montoConvertido = ref(0)

    const blankData = {
      idConversion: 0,
      monto: 0,
      montoConvertido: 0,
      tipoCambio: {
        idTipoCambio: 0,
      },
      estado: true,
    }
    
    const formData = ref(JSON.parse(JSON.stringify(blankData)))
    const parseDate = date => {
      const date1 = (!date || date === null) ? '' : moment(date).locale('es').format('YYYY-MM-DD')
      return date1
    }
    const dataTypeChange = async () => {
      console.log(fecha.value)// eslint-disable-line
      await store
        .dispatch('softadministracion/TIPO_CAMBIO_FIND_ALL', {
          limit: -1,
          query: '',
          page: -1,
          sortBy: 'idTipoCambio%7CDESC',
          fecha: parseDate(fecha.value),
        })
        .then(response => {
          if (response !== undefined) {
            optionsTipoCambio.value = response 
          }
        })
        .catch(error => {
          notify('Ha ocurrido un error', error.response.data.message, 'danger')
        })
    }
    const getData = async() => {
      if (props.typeAction === 'edit') {
        fecha.value = await parseDate(props.dataEdit.createdAt)
        await dataTypeChange()
        formData.value = {
          idConversion: props.dataEdit.idConversion,
          monto: props.dataEdit.monto,
          montoConvertido: props.dataEdit.montoConvertido,
          tipoCambio: props.dataEdit.tipoCambio,
          estado: props.dataEdit.estado,
        }
        monto.value = props.dataEdit.monto
        montoConvertido.value = props.dataEdit.montoConvertido
        tipoCambio.value = props.dataEdit.tipoCambio.idTipoCambio
        venta.value = props.dataEdit.tipoCambio.venta
      } else {
        await dataTypeChange()
      }
    }
    getData()

    const selectDate = async () => {
      await dataTypeChange()
    }
    const seleccionarTipoCambio = () => {
      if(tipoCambio.value !== '' && tipoCambio !== null) {
        const row = _.findWhere(optionsTipoCambio.value, { idTipoCambio: tipoCambio.value })
        venta.value = row.venta
        const result = monto.value * venta.value
        console.info(result) // eslint-disable-line
        montoConvertido.value = result
      }
    }
    const hide = () => {
      context.emit('update:modal-show', false)
    }

    const saveForm = async () => {
      isBusy.value = true
      let bval = true
      if (bval && tipoCambio.value === '') {
        notify('Advertencia', 'Seleccione un tipo de cambio', 'warning')
        bval = false
        isBusy.value = false
      }
      const row = _.findWhere(optionsTipoCambio.value, { idTipoCambio: tipoCambio.value })

      formData.value.tipoCambio = {
        idTipoCambio: tipoCambio.value,
        monedaOrigen: row.monedaOrigen,
        monedaDestino: row.monedaDestino,
        fecha: row.fecha,
      }
      formData.value.monto = monto.value
      formData.value.montoConvertido = montoConvertido.value
      if(bval) {
        let service = 'softadministracion/CONVERSION_CREATE'
        if (props.typeAction === 'edit') {
          service = 'softadministracion/CONVERSION_UPDATE'
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
    }

    return {
      hide,
      saveForm,
      isBusy,
      formData,
      isBusyReniec,
      optionsTipoCambio,
      tipoCambio,
      fecha,
      seleccionarTipoCambio,
      venta,
      monto,
      montoConvertido,
      selectDate,
      parseDate,
    }
  },
  methods: {
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
  },
}

</script>