<template>
  <b-row>
    <b-col>
      <b-card no-body>
        <form action="#" @submit.prevent="saveForm">
          <b-row class="mb-2">
            <b-col
              sm="4"
            >
              <label>Perfil</label>
              <div>
                <b-form-select
                  v-model="profile"
                  type="select"
                  class="form-select"
                >
                  <option value="">
                    SELECCIONE::
                  </option>
                  <option
                    v-for="pro in optionProfile"
                    :key="pro.idProfile"
                    :value="pro.idProfile"
                  >
                    {{ pro.description }}
                  </option>
                </b-form-select>
              </div>
            </b-col>
            <b-col
              sm="3"
            >
              <label>Fecha Inicio</label>
              <div>
                <b-form-datepicker
                  id="fechaStart"
                  v-model="dateStart"
                  class="mb-1"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                  locale="es"
                  placeholder="Selecccione fecha"
                />
              </div>
            </b-col>
            <b-col
              sm="3"
            >
              <label>Fecha Final</label>
              <div>
                <b-form-datepicker
                  id="fechaFinal"
                  v-model="dateEnd"
                  class="mb-1"
                  :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                  locale="es"
                  placeholder="Selecccione fecha"
                />
              </div>
            </b-col>
            <b-col
              sm="1"
            >
              <label>&nbsp;</label>
              <div>
                <b-button
                  variant="success"
                  @click="addRol"
                >
                  Agregar
                </b-button>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <div class="col-md-12">
              <b-table
                :items="items"
                :fields="fields"
                striped
                responsive
                :busy="isBusyDetail"
              >
                <!-- <template #cell(dateRange)="data">
                  <span
                    v-if="data.item.dateRange == true"
                    pill
                    variant="light-success"
                    class="badge-soft-success"
                  >
                    Activo
                  </span>
                  <span
                    v-if="data.item.dateRange == false"
                    pill
                    variant="light-danger"
                    class="badge-soft-danger"
                  >
                    Inactivo
                  </span>
                </template> -->
                <template #cell(profile)="data">
                  <b-media vertical-align="center">
                    <b-link
                      class="font-weight-bold d-block text-nowrap"
                    >
                      {{ data.item.profile.description }}
                    </b-link>
                  </b-media>
                </template>
                <template #cell(dateRange)="data">
                  <input
                    type="checkbox"
                    :id="`valor${data.item.dateRange}`"
                    v-model="data.item.dateRange"
                    :value="data.item.dateRange"
                    class="dateRange"
                    :checked="false"
                  />
                  <!-- <b-form-checkbox
                   :id="`valor${data.item.dateRange}`"
                    v-model="data.item.dateRange"
                    :value="data.item.dateRange"
                    class="dateRange"
                    :checked="false"
                  />-->
                </template>
                <template #cell(op)="row">
                  <a
                    href="javascript:void(0)"
                    title="Eliminar"
                    @click.stop="deleteRow(row, 'delete')"
                  >
                    <b-button
                      variant="danger"
                      class="btn-sm"
                    >
                      <i class="bx bx-trash"></i>
                    </b-button>
                  </a>
                </template>
              </b-table>
            </div>
          </b-row>
          <br><br><br>
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
  BRow, BCol, BCard, BFormSelect, BButton, BFormDatepicker, BTable,
} from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import moment from 'moment-timezone'
import { _ } from 'vue-underscore'
import Swal from 'sweetalert2'
import { useNotify } from '@/helpers/toast'

export default {
  emits: ['update:is-busy-form', 'update:modal-show', 'update:data-edit'],
  props: {
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
    BFormSelect,
    BButton,
    BFormDatepicker,
    BTable,
  },
  setup(props, context) {
    const { notify } = useNotify(context)
    const dateStart = ref(moment().format('YYYY-MM-DD'))
    const dateEnd = ref(moment().format('YYYY-MM-DD'))
    const optionProfile = ref({})
    const profile = ref('')
    const isBusy = ref(false)
    const isBusyDetail = ref(false)
    const items = ref([])
    const arrDetail = ref([])
    const dateRange = ref(false)
    const fields = ref([
      { key: 'profile', label: 'Perfil'},
      { key: 'dateStart', label: 'Fecha Inicio'},
      { key: 'dateEnd', label: 'Fecha Final'},
      { key: 'dateRange', label: '¿Usa Rango?', thStyle: { width: '5px' } },
      { key: 'op', thStyle: { width: '5px' } },
    ])

    const dataForm = () => {
      store
        .dispatch('softseguridad/PROFILE_FIND_ALL', {
          limit: -1,
          query: '',
          page: -1,
          sortBy: '',
          // estado
        })
        .then(response => {
          if (response !== undefined) {
            optionProfile.value = response.data.items
          }
        })
        .catch(() => {
          // notify(error, 'He ocurrido un error', 'danger')
        })
    }
    dataForm()

     const getData = () => {
      items.value = []
      arrDetail.value = []
      store
        .dispatch('softseguridad/ROL_FIND_ALL', {
          idUser: props.dataEdit.idUser,
        })
        .then(response => {
          items.value = []
          if (response !== undefined) {
            response.forEach((r, i) => {
               console.log(r.dateRange)// eslint-disable-line
               items.value.push({
                 index: i,
                 idRol: r.idRol,
                 profile: r.profile,
                 dateStart: r.dateStart,
                 dateEnd: r.dateEnd,
                 dateRange: r.dateRange,
                 idUser: r.idUser,
               })
               arrDetail.value.push(r.profile.idProfile)
            })
          }
        })
        .catch(() => {
          // notify(error, 'He ocurrido un error', 'danger')
        })
    }
    getData()
    
    const hide = () => {
      context.emit('update:modal-show', false)
    }

    const addRol = () => {
      if (!_.isUndefined(profile.value) && profile.value !== '') {
        if (!_.contains(arrDetail.value, profile.value)) {
            const filterProfile = _.findWhere(optionProfile.value, { idProfile: profile.value })
            const row = {
                index: 0,
                idRol: 0,
                idUser: props.dataEdit.idUser,
                profile: filterProfile,
                dateStart: dateStart.value,
                dateEnd: dateEnd.value,
                dateRange: false,
            }
            items.value.push(row)
            items.value.forEach((da, i) => {
            items.value[i].index = i
            })
            arrDetail.value.push(profile.value)
        } else {
            notify('Advertencia', 'Este perfil ya fue agregado', 'warning')
        }
      } else {
        notify('Advertencia', 'Seleccione un perfil', 'warning')
      }
    }
    const deleteRow = row => {
        Swal.fire({
        title: "¿Está seguro de eliminar este registro?",
        // text: "Va eliminar un registro!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Si",
      }).then((result) => {
        if (result.value) {
          if (result.value) {
            items.value.splice(row.index, 1)
            arrDetail.value = _.reject(arrDetail.value, item => item === row.item.profile.idProfile)
          }
        }
      })
    }
    const saveForm = async () => {
      let bval = true
      isBusy.value = true
      if (bval && items.value.length <=0 ) {
        notify('Advertencia', 'Debe agregar un perfil al detalle', 'warning')
        bval = false
        isBusy.value = false
      }
      if (bval) {
        const params = []
        items.value.forEach(r => {
          params.push({
            idRol: r.idRol,
            profile: r.profile,
            dateStart: moment.tz(moment(String(r.dateStart)).format('YYYY-MM-DD[T]HH:mm:ss'), 'America/Lima'),
            dateEnd: moment.tz(moment(String(r.dateEnd)).format('YYYY-MM-DD[T]HH:mm:ss'), 'America/Lima'),
            dateRange: r.dateRange,
            idUser: r.idUser,
          })
        })
        await store.dispatch('softseguridad/ROL_CREATE_UPDATE', params)
          .then(()=> {
            isBusy.value = false
            notify('Título', 'El proceso se ha ejecutado satisfactoriamente', 'success') 
            context.emit('refetch-data')
            context.emit('update:modal-show', false)
          })
          .catch(error => {
            isBusy.value = false
            bval = false
            notify('error', error.response.data.message, 'danger')
          })
      }
    }

    return {
      dateStart,
      dateEnd,
      optionProfile,
      profile,
      isBusy,
      hide,
      isBusyDetail,
      items,
      fields,
      addRol,
      deleteRow,
      arrDetail,
      saveForm,
      getData,
      dateRange,
    }
  }
}
</script>