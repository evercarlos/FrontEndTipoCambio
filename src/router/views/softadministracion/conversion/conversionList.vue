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
      :busy="isBusyModalService"
      :hide-footer="true"
      @ok="okMdl"
    >
      <b-overlay
        :show="isBusyModalService"
        rounded="sm"
      >
        <conversion-form
          ref="refConversionForm"
          :is-busy-form.sync="isBusyModalService"
          :modal-show.sync="modalShow"
          :data-edit="dataForm"
          :type-action="formType"
          @refetch-data="refetchData"
          @error-data="showError"
        />
      </b-overlay>
    </b-modal>
    <b-card
      no-body
      class="mb-0"
    >
      <b-card-body>
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
        <b-row>
          <b-col lg="12">
            <b-row class="mb-3">
              <b-col sm="12" lg="12">
                <div class="mt-4 mt-sm-0 float-sm-end d-flex align-items-center">
                  <div class="search-box me-2" style="border: 1px solid rgb(0 0 0 / 18%);">
                    <div class="position-relative">
                      <input
                        type="text"
                        class="form-control border-0"
                        v-model="query"
                         placeholder="Buscar una conversión..."
                         @change="searchData"
                      />
                      <i class="bx bx-search-alt search-icon"></i>
                    </div>
                  </div>
                  <ul class="nav nav-pills product-view-nav">
                    <li class="nav-item">
                      <b-button
                        variant="primary"
                        @click="openForm('new')"
                        style='margin-left:5px'
                      >
                        <span class="text-nowrap">Nuevo</span>
                      </b-button>
                    </li>
                  </ul>
                </div>
              </b-col>
            </b-row>
            <div
              v-if="tableData.length<=0 && !isBusy"
              class="text-center text-primary my-2"
            >
              <strong class="ml-1">No se encontraron ningún registro</strong>
            </div>
            <b-row>
              <div
                v-for="data in tableData"
                :key="data.id"
                class="col-xl-3 col-sm-5"
              >
                <section class="grid-view1">
                  <b-card
                    class="card-cuant"
                    no-body
                  >
                    <!--<b-card-header style="padding:0px !important">
                      <div class="product-img position-relative">
                        <div  class="avatar-sm product-ribbon">
                          <span class="avatar-title rounded-circle bg-primary"
                            >20</span
                          >
                        </div>
                        <div
                          class="item-img text-center"
                          style=" min-height: 0rem !important"
                        >
                         <i class="bx bx-search-alt-2"></i>
                        </div>
                      </div>
                    </b-card-header>-->
                    <b-card-body>
                      <div class="mt-2 text-center">
                        <h5 class="mb-2 text-truncate">
                        <!-- 
                            :to="`/ecommerce/product-detail/${data.idDoctor}`" -->
                          <b>{{ data.tipoCambio.descripcion }}</b><br>
                        </h5>
                        <b>
                          <b-badge class="badge badge-light-primary"> Tipo Cambio: {{data.tipoCambio.venta}}</b-badge>
                        </b>
                        <b>
                          <b-badge class="badge badge-light-primary"> Fecha Cálculo:  {{ parseDate(data.createdAt) }}</b-badge>
                        </b>
                        <p
                          style="padding:2%; color: #6e6b7b;"
                          class="text-truncate"
                          data-toggle="tooltip"
                          data-placement="top"
                        >
                          Monto: {{ data.monto }}
                        </p>
                        <p
                          style="padding:2%; color: #6e6b7b;"
                          class="text-truncate"
                          data-toggle="tooltip"
                          data-placement="top"
                        >
                          Monto Convertido: {{ data.montoConvertido }}
                        </p>
                        <p>
                          <b-button
                              variant="danger"
                              class="btn-sm"
                              @click="getDelete(data)"
                            >
                              <span class="text-nowrap">Eliminar</span>
                            </b-button>
                            <b-button
                              variant="success"
                              @click="openEdit(data)"
                              style="margin-left: 5px;!imporant"
                              class="btn-sm"
                            >
                              <span class="text-nowrap">Editar</span>
                            </b-button>
                        </p>
                      </div>
                    </b-card-body>
                  </b-card>
                </section>
              </div>
            </b-row>
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
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </Layout>
</template>

<script>
import store from '@/state/store'
import Layout from "../../../layouts/main";
import moment from 'moment-timezone'
import { ref } from '@vue/composition-api'
import PageHeader from '@/components/page-header'
import { useNotify } from '@/helpers/toast'
import Swal from 'sweetalert2'
import conversionForm from './conversionForm'

import {
  BRow,
  BCol,
  BCard,
  BCardBody,
  BBadge,
  BSpinner,
} from 'bootstrap-vue'

export default {
  components: {
    Layout,
    PageHeader,
    BRow,
    BCol,
    BCard,
    BCardBody,
    BBadge,
    BSpinner,
    conversionForm,
  },
   setup(props, context) {
    const { notify } = useNotify(context)
    const title = ref('Lista las Conversiones')
    const items = ref([
      {
        text: 'Administración',
        href: '/'
      },
      {
        text: 'Conversión',
        active: true,
      }
    ])
    const tableData = ref([])
    const isBusy = ref(false)
    const query = ref('')
    const page = ref(1)
    const totalItems = ref(0)
    const perPage = ref(10)
    const totalRows = ref(0)
    const from = ref(0)
    const to = ref(0)
    const of = ref(0)
    const pageOptions = ref([10, 20, 50])
    const sortBy = ref(null)
    const titleModal = ref( '')
    const modalShow = ref(false)
    const dataForm = ref({})
    const formType = ref('new')
    const refServiceForm = ref(null)
    //
    const formTypeResource = ref('new')
    const titleModalResource = ref('Gestión de Recursos')
    const dataFormResource = ref({})
    const modalShowResource = ref(false)
    const isBusyModalService = ref(false)
    const isBusyModalResource = ref(false)
    const parseDate = date => {
      const ca = moment(date).format('DD/MM/YYYY')
      return ca
    }

    const openForm = () => {
      formType.value = 'new'
      titleModal.value = 'Registrar una Conversión'
      modalShow.value = true
    }
    const openEdit = row => {
      formType.value = 'edit'
      titleModal.value = 'Editar una Conversión'
      // console.log(row) // eslint-disable-line
      dataForm.value = row
      modalShow.value = true
    }
    const getResource = row => {
      formTypeResource.value = 'edit'
      titleModalResource.value = 'Gestión de Recursos'
      dataFormResource.value = row
      modalShowResource.value = true
    }
    const okMdl = ev => {
        ev.preventDefault()
        refServiceForm.saveForm()
    }
    const listRecords = () => {
        isBusy.value = true
        store.dispatch('softadministracion/CONVERSION_FIND_ALL', {
          limit: perPage.value,
          query: query.value,
          page: page.value,
          sortBy: 'idConversion%7CDESC',
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
      const refetchData = () => {
        listRecords()
      }
      const showError = error => {
        notify(error, 'He ocurrido un error', 'danger')
      }
      const getDelete = data => {
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
          .dispatch('softadministracion/CONVERSION_DELETE', {
              id: data.idConversion,
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
      sortBy,
      isBusy,
      page,
      totalItems,
      perPage,
      totalRows,
      from,
      to,
      of,
      pageOptions,
      openForm,
      tableData,
      query,
      listRecords,
      searchData,
      titleModal,
      modalShow,
      dataForm,
      formType,
      okMdl,
      refServiceForm,
      refetchData,
      showError,
      openEdit,
      getDelete,
      getResource,
      formTypeResource,
      titleModalResource,
      dataFormResource,
      modalShowResource,
      isBusyModalService,
      isBusyModalResource,
      parseDate,
    }
  }
}
</script>
<style scoped>
 .card-cuant {
  box-shadow: rgb(0 0 0 / 16%) 0px 3px 2px 0px, rgb(0 0 0 / 8%) 0px 0px 0px 1px !important;
  border-radius:3%;
  height: 220px!important;
  max-height: 220px !important;
 }
@media (min-width: 1200px){
  .col-xl-3 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 auto;
      flex: 0 0 auto;
      width: 20%;
  }
}
</style>