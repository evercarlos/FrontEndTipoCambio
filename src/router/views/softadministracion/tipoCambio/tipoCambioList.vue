<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <b-modal
      v-model="modalShow"
      size="md"
      :title="titleModal"
      ok-title="Guardar"
      cancel-variant="outline-secondary"
      no-close-on-backdrop
      no-close-on-esc
      :busy="isBusy"
      :hide-footer="true"
      @ok="okMdl"
    >
      <b-overlay
        :show="isBusyModal"
        rounded="sm"
      >
        <tipo-cambio-form
          ref="refMonedaForm"
          :is-busy-form.sync="isBusyModal"
          :modal-show.sync="modalShow"
          :data-edit="dataForm"
          :type-action="formType"
          @refetch-data="refetchData"
          @error-data="showError"
        />
      </b-overlay>
    </b-modal>
    <b-row>
      <b-col
        md="12"
      >
        <b-card>
          <b-row class="mt-4">
            <b-col sm="12" md="6">
              <div id="tickets-table_length" class="dataTables_length">
                <label class="d-inline-flex align-items-center">
                Mostrando&nbsp;
                <b-form-select
                    class="form-select form-select-sm"
                    v-model="perPage"
                    size="sm"
                    :options="pageOptions"
                ></b-form-select
                >&nbsp;registros
                </label>
              </div>
            </b-col>
            <b-col sm="12" md="6">
              <div
                id="tickets-table_filter"
                class="dataTables_filter text-md-end"
              >
                <div class="d-flex align-items-center justify-content-end">
                  Buscar:
                <b-form-input
                    v-model="query"
                    type="search"
                    placeholder="Buscar..."
                    class="form-control form-control-sm ms-2"
                    @change="searchData"
                ></b-form-input>
                <b-button
                    variant="primary"
                    size="sm"
                    @click="openForm('new')"
                    style='margin-left:5px'
                >
                    <span class="text-nowrap">Nuevo</span>
                </b-button>
                </div>
              </div>
            </b-col>
          </b-row>
          <div class="mb-0">
            <b-table
                id="idTable"
                ref="refUserListTable"
                class="position-relative"
                :items="tableData"
                :fields="fields"
                primary-key="id"
                :sort-by.sync="sortBy"
                show-empty
                empty-text="No se encontraron registros"
                :busy="isBusy"
                head-variant="light"
              >
        
                <template #table-busy>
                  <div class="text-center text-primary my-2">
                    <b-spinner
                      variant="primary"
                      class="align-middle"
                    />
                    <strong class="ml-1">Cargando...</strong>
                  </div>
                </template>
                <template #cell(username)="data">
                  <b-media vertical-align="center">
                    <b-link
                        class="font-weight-bold d-block text-nowrap"
                    >
                        {{ data.item.name }} {{ data.item.lastName }} {{ data.item.maternalSurname }}
                    </b-link>
                    <small class="text-muted">Usuario:{{ data.item.username }}</small>
                  </b-media>
                </template>
                <template #cell(fecha)="data">
                   {{ parseDate(data.item.fecha) }}
                </template>
                <template #cell(state)="data">
                  <b-badge
                    v-if="data.item.state == true"
                    pill
                    variant="light-success"
                    class="text-capitalize"
                    >
                    Activo
                  </b-badge>
                  <b-badge
                    v-if="data.item.state == false"
                    pill
                    variant="light-danger"
                    class="text-capitalize"
                    >
                    Inactivo
                  </b-badge>
                </template>
                <!-- Column: Actions -->
                <template #cell(acciones)="data">
                  <b-dropdown
                    text="Button text via Prop"
                    toggle-class="text-muted font-size-16 p-0"
                    menu-class="dropdown-menu-end"
                    variant="white"
                    right
                  >
                    <template #button-content>
                      <i class="mdi mdi-dots-vertical"></i>
                    </template>
                    <b-dropdown-item @click="getEdit(data)">Editar</b-dropdown-item>
                    <b-dropdown-item @click="getDelete(data)">Eliminar</b-dropdown-item>
                  </b-dropdown>
                </template>

              </b-table>
          </div>
          <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination
                      v-model="page"
                      :total-rows="totalItems"
                      :per-page="perPage"
                    ></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
        </b-card>
      </b-col>
    </b-row>
  </Layout>
</template>
<script>
import store from '@/state/store'
import { ref } from '@vue/composition-api'
import PageHeader from "@/components/page-header"
import Layout from "../../../layouts/main"
import { useNotify } from '@/helpers/toast'
import Swal from 'sweetalert2'
import moment from 'moment-timezone'
import tipoCambioForm from './tipoCambioForm'

import {
  BRow, // BDropdown, BDropdownItem,
  BFormInput,
  BButton,
  BCol,
  BBadge,
  BOverlay,
} from 'bootstrap-vue'

export default ({
    components: {
      Layout,
      PageHeader,
      BRow,
      BFormInput,
      BButton,
      BCol,
      BBadge,
      tipoCambioForm,
      BOverlay,
    },
    watch: {
    perPage: {
      handler() {
        this.listRecords()
      },
    },
    page: {
      handler() {
        this.listRecords()
      },
    },
  },
    setup(props, context) {
      const { notify } = useNotify(context)
      const title = ref('Lista los Tipos de Cambio')
      const items = ref([
        {
          text: "Administración",
          href: "/",
        },
        {
          text: "Tipo Cambio",
          active: true,
        },
      ])
      const fields = ref([
        { key: 'idTipoCambio', sortable: true, thClass: 'd-none', tdClass: 'd-none' },
        { key: 'descripcion', label: 'Descripción', sortable: true },
        { key: 'fecha', label: 'Fecha', sortable: true },
        { key: 'venta', label: 'Valor', sortable: true },
        { key: 'monedaOrigen.descripcion', label: 'Moneda Origen', sortable: true },
        { key: 'monedaDestino.descripcion', label: 'Moneda Destino', sortable: true },
        { key: 'acciones' , label: 'ACCIONES', thStyle: { width: '5px' } },
      ])
      const tableData = ref([])
      const sortBy = ref(null)
      const isBusy = ref(false)
      const page = ref(1)
      const totalItems = ref(0)
      const perPage = ref(10)
      const query = ref('')
      const totalRows = ref(0)
      const from = ref(0)
      const to = ref(0)
      const of = ref(0)
      const pageOptions = ref([10, 20, 50])
      const formType = ref('new')
      const titleModal = ref('Modal')
      const modalShow = ref(false)
      const isBusyModal = ref(false)
      const dataForm = ref({})
      const refResourceTypeForm = ref(null)

      const listRecords = async () => {
        isBusy.value = true
        await store.dispatch('softadministracion/TIPO_CAMBIO_FIND_ALL', {
          limit: perPage.value,
          query: query.value,
          page: page.value,
          sortBy: 'idTipoCambio%7CDESC',
          fecha: '',
        })
        .then(response => {
          tableData.value = response.items
          totalRows.value = response.totalRows
          totalItems.value = response.totalItems
          from.value = perPage.value * (page.value - 1) + (totalRows.value ? 1 : 0)
          to.value = perPage.value * (page.value - 1) + totalRows.value
          of.value = totalItems.value
          isBusy.value = false
        })
        .catch(error => {
          notify('Título', error.response.data.message, 'danger')
        })
      }
      listRecords()

      const searchData = () => {
        listRecords()
      }
      const openForm =type => {
        formType.value = type
        titleModal.value = 'Nuevo Tipo Cambio'
        modalShow.value = true
      }
      const getEdit = data => {
        formType.value = 'edit'
        titleModal.value = 'Editar Tipo Cambio'
        dataForm.value = data.item
        modalShow.value = true
      }
      const refetchData = () => {
        listRecords()
      }
      const showError = error => {
        notify(error, 'He ocurrido un error', 'danger')
      }
      const parseDate = date => {
        const ca = moment(date).format('DD/MM/YYYY')
        return ca
      }
      const okMdl = ev => {
        ev.preventDefault()
        refResourceTypeForm.saveForm()
      }
      const getDelete = async data => {
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
         store
          .dispatch('softadministracion/TIPO_CAMBIO_DELETE', {
              id: data.item.idTipoCambio,
            })
            .then(() => {
              notify('Título', 'He eliminado correctamente', 'success')
              listRecords()
            })
            .catch(error => {
              notify('error', error.response.data.message, 'danger')
            })
        }
      })
    }

      return {
        title,
        items,
        fields,
        tableData,
        sortBy,
        isBusy,
        page,
        totalItems,
        perPage,
        query,
        totalRows,
        from,
        to,
        of,
        pageOptions,
        formType,
        titleModal,
        modalShow,
        openForm,
        getEdit,
        dataForm,
        refetchData,
        isBusyModal,
        refResourceTypeForm,
        okMdl,
        showError,
        getDelete,
        searchData,
        listRecords,
        parseDate,
      }
    },
})
</script>
