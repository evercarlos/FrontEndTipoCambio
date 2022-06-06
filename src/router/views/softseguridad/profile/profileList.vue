<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <b-modal
      v-model="modalShow"
      size="sm"
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
        <profile-form
          ref="refProfileForm"
          :is-busy-form.sync="isBusyModal"
          :modal-show.sync="modalShow"
          :data-edit="dataForm"
          :type-action="formType"
          @refetch-data="refetchData"
          @error-data="showError"
        />
      </b-overlay>
    </b-modal>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
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
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div
                  id="tickets-table_filter"
                  class="dataTables_filter text-md-end"
                >
                  <!--<label class="d-inline-flex align-items-center">-->
                   <div class="d-flex align-items-center justify-content-end">
                    Buscar:
                    <b-form-input
                      v-model="query"
                      type="search"
                      placeholder="Search..."
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
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
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
                <!--<template #cell(acciones)="data">
                  <a href="javascript:void(0)"  @click="getEdit(data)">
                    <i class="fas fa-pencil-alt fa-1-0x fa-green"></i>
                  </a>
                  <a href="javascript:void(0)"  @click="getDelete(data)" style="padding-left:4px">
                    <i class="fas fa-trash-alt fa-1-0x fa-red"></i>
                  </a>
                </template>-->

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
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script>
// import axios from "axios";

import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Swal from "sweetalert2";
import profileForm from './profileForm'

import {
  BButton, BOverlay, // BDropdown, BDropdownItem,
} from 'bootstrap-vue'
/**
 * Advanced table component
 */
export default {
  page: {
    title: "Lista los Perfiles",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
    BButton,
    BOverlay,
    profileForm,
    // BDropdown,
    // BDropdownItem,
  },
  data() {
    return {
      title: "Lista de Perfiles",
      items: [
        {
          text: "Seguridad",
          href: "/",
        },
        {
          text: "Perfil",
          active: true,
        },
      ],
      todoTotalRows: 1,
      currentPage: 1,
      todoList: 40,
      todos: [],
      todocurrentPage: 1,
      rows: 30,
      todoperPage: 10,
      todoOptions: [10, 50, 100, 150, 200],
      filter: null,
      todoFilter: null,
      filterOn: [],
      todofilterOn: [],
      tableData: [],
      /**/
      page: 1,
      perPage: 10,
      totalRows: 0,
      totalItems: 0,
      totalPage: 0,
      from: 0,
      to: 0,
      of: 0,
      pageOptions: [10, 20, 50],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      query: '',
      isBusy: false,
      modalShow: false,
      isBusyModal: false,
      titleModal: 'Modal',
      formType: 'New',
      dataForm: {},
      /**/
      fields: [
      { key: 'idPerfil', sortable: true, thClass: 'd-none', tdClass: 'd-none' },
      { key: 'descripcion', label: 'Descripción', sortable: true },
      { key: 'acciones' , label: 'ACCIONES', thStyle: { width: '5px' } },
    ],
    };
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
    /* query: {
      handler() {
        this.listRecords()
      },
    }, */
  },
  mounted() {
    this.listRecords();
  },
  methods: {
    async listRecords() {
      this.isBusy = true
      await this.$store
        .dispatch('softseguridad/PROFILE_FIND_ALL', {
          limit: this.perPage,
          query: this.query,
          page: this.page,
          sortBy: 'idPerfil%7CDESC',
        })
        .then(response => {
          this.tableData = response.items
          this.totalRows = response.totalRows
          this.totalItems = response.totalItems
          this.totalPage = response.totalPage
          this.from = this.perPage * (this.page - 1) + (this.totalRows ? 1 : 0)
          this.to = this.perPage * (this.page - 1) + this.totalRows
          this.of = this.totalItems
          this.isBusy = false
        })
        .catch(error => {
          console.log(error)// eslint-disable-line
          this.showError(error)
          this.isBusy = false
        })
    },
    
    refetchData(response) {
      let message = 'El proceso se ha ejecutado satisfactoriamente.'
      if (response.message) {
        message = response.message
      }
      this.$toast(message, {
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
      this.listRecords()
    },
    searchData() {
        this.listRecords()
    },
    showError(error) {
      this.$toast.error(error.response.data.message, {
        title: 'Ha ocurrido un error',
        variant: 'danger',
        solid: true,
      })
    },
    okMdl(ev) {
      ev.preventDefault()
      this.$refs.refProfileForm.saveForm();
      // refTratamientoForm.value.saveForm()
    },
    openForm(type) {
      this.formType = type
      this.titleModal= 'Nuevo Perfil'
      this.modalShow = true
    },
    getEdit(data) {
      this.formType = 'edit'
      this.titleModal= 'Editar Perfil'
      this.dataForm = data.item
      this.modalShow = true
    },
    getDelete(data) {
      console.log(data) // eslint-disable-line
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
          this.$store
          .dispatch('softseguridad/PROFILE_DELETE', {
              id: data.item.idPerfil,
            })
            .then(response => {
              this.listRecords()
              this.$toast.info('Ha Eliminado correctamente el registro.', {
                title: 'Ha ocurrido un error',
                variant: 'danger',
                solid: true,
              })
              // Swal.fire("Operación exitosa", "Ha Eliminado correctamente el registro.", "success");
              return response;
            })
            .catch(error => {
              this.$toast.error(error.response.data.errorMessage, {
                title: 'Ha ocurrido un error',
                variant: 'danger',
                solid: true,
              })
              // Swal.fire("Ha ocurrido un error", error.response.data.errorMessage, "danger");
            })
        }
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    todoFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.todoTotalRows = filteredItems.length;
      this.todocurrentPage = 1;
    },

    handleInput(value, data) {
      this.editableDataItems[data.index][data.field.key] = value;
    }
  },
};
</script>
<style>
.per-page-selector {
  width: 90px;
}

.fa-green {
    color: #18a689;
}

.fa-blue {
    color: #31b0d5;
}

.fa-red {
    color: #d9534f;
}

.fa-orange {
    color: #f0ad4e;
}
.fa-1-0x {
    font-size: 1em;
}
.thead-light {
  background-color: #f3f2f7;
}
.table th {
    font-weight: 500;
}
</style>