<template>
  <b-card
    no-body
    class="mb-0"
  >
    <b-table
      id="idTable"
      ref="refUserListTable"
      class="position-relative"
      :items="items"
      :fields="fields"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No se encontraron registros"
      :busy="isBusy"
      head-variant="light"
    >
      <template #cell(acciones)="data">
        <a
          href="javascript:void(0)"
          title="Seleccionar"
          @click="selectProfile(data.item)"
        >
          <i 
            class="bx bxs-check-circle mr-50 fa-red"
            style="font-size:20px"
          />
        </a>
      </template>
    </b-table>
  </b-card>
</template>
<script>
// import store from '@/state/store'
import { ref } from '@vue/composition-api'

export default {
  emits: ['update:is-busy-form', 'update:modal-show', 'update:data-edit'],
  props: {
    dataEdit: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const items = ref(props.dataEdit.profiles)
    const isBusy =ref(false)
    const sortBy = ref(null)
    const fields = ref([
      { key: 'profile.idProfile', sortable: true, thClass: 'd-none', tdClass: 'd-none' },
      { key: 'profile.description', label: 'Descripción', sortable: true },
      { key: 'acciones' , label: 'SEL', thStyle: { width: '5px' } },
    ])
    const selectProfile = row => {
      context.emit('refetch-data', row.profile.idProfile)
    }
    return {
      items,
      fields,
      sortBy,
      isBusy,
      selectProfile,
    }
  }
}
</script>
