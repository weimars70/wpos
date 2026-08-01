<template>
  <q-dialog v-model="open" persistent>
    <q-card style="min-width: 420px; max-width: 540px; width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ isEdit ? 'Editar usuario' : 'Nuevo usuario' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form ref="formRef" class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Nombre completo"
            outlined
            lazy-rules
            :rules="[v => !!v || 'Requerido', v => v.length >= 2 || 'Mínimo 2 caracteres']"
          >
            <template #prepend><q-icon name="person" /></template>
          </q-input>

          <q-input
            v-model="form.email"
            type="email"
            label="Correo electrónico"
            outlined
            lazy-rules
            :rules="[v => !!v || 'Requerido', v => /.+@.+\..+/.test(v) || 'Email inválido']"
          >
            <template #prepend><q-icon name="email" /></template>
          </q-input>

          <q-input
            v-model="form.password"
            :type="showPass ? 'text' : 'password'"
            :label="isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'"
            outlined
            lazy-rules
            :rules="isEdit
              ? [v => !v || v.length >= 6 || 'Mínimo 6 caracteres']
              : [v => !!v || 'Requerido', v => v.length >= 6 || 'Mínimo 6 caracteres']"
          >
            <template #prepend><q-icon name="lock" /></template>
            <template #append>
              <q-icon
                :name="showPass ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPass = !showPass"
              />
            </template>
          </q-input>

          <q-input
            v-model="form.confirmPassword"
            :type="showConfirmPass ? 'text' : 'password'"
            :label="isEdit ? 'Confirmar nueva contraseña' : 'Confirmar contraseña'"
            outlined
            lazy-rules
            :rules="isEdit
              ? [
                  v => !form.password || !!v || 'Debes confirmar la contraseña',
                  v => !form.password || v === form.password || 'Las contraseñas no coinciden'
                ]
              : [
                  v => !!v || 'Requerido',
                  v => v === form.password || 'Las contraseñas no coinciden'
                ]"
          >
            <template #prepend><q-icon name="lock_outline" /></template>
            <template #append>
              <q-icon
                :name="showConfirmPass ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPass = !showConfirmPass"
              />
            </template>
          </q-input>

          <q-select
            v-model="form.empresaIds"
            :options="empresaOptions"
            label="Empresas / Sucursales autorizadas"
            outlined
            multiple
            use-chips
            emit-value
            map-options
            :loading="loadingEmpresas"
            hint="Selecciona las tiendas/sucursales del grupo empresarial a las que tendrá acceso"
          >
            <template #prepend><q-icon name="storefront" /></template>
          </q-select>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md q-pt-none">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn
          color="primary"
          :label="isEdit ? 'Guardar cambios' : 'Crear usuario'"
          unelevated
          :loading="loading"
          @click="handleSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { usersApi, User, EmpresaGrupo } from 'src/api/users';

const props = defineProps<{ modelValue: boolean; user: User | null }>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'saved'): void;
}>();

const $q = useQuasar();
const formRef = ref();
const loading = ref(false);
const loadingEmpresas = ref(false);
const showPass = ref(false);
const showConfirmPass = ref(false);

const isEdit = computed(() => !!props.user);
const empresaOptions = ref<{ label: string; value: number }[]>([]);

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  empresaIds: [] as number[],
});

async function fetchEmpresasGrupo() {
  loadingEmpresas.value = true;
  try {
    const { data } = await usersApi.getEmpresasGrupo();
    empresaOptions.value = data.map((e: EmpresaGrupo) => ({
      label: e.nombre,
      value: e.id,
    }));
  } catch (err) {
    console.error('Error al cargar empresas del grupo:', err);
  } finally {
    loadingEmpresas.value = false;
  }
}

watch(
  () => props.user,
  async (u) => {
    form.name = u?.name || '';
    form.email = u?.email || '';
    form.password = '';
    form.confirmPassword = '';

    if (u?.email) {
      try {
        const { data } = await usersApi.getUserEmpresas(u.email);
        form.empresaIds = data && data.length > 0 ? data : (u.empresaId ? [u.empresaId] : []);
      } catch (err) {
        console.error('Error al cargar empresas asignadas del usuario:', err);
        form.empresaIds = u.empresaId ? [u.empresaId] : [];
      }
    } else {
      form.empresaIds = [];
    }
  },
  { immediate: true },
);

watch(open, (val) => {
  if (val) {
    fetchEmpresasGrupo();
  }
});

onMounted(() => {
  fetchEmpresasGrupo();
});

async function handleSave() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    if (isEdit.value && props.user) {
      const payload: any = {
        name: form.name,
        email: form.email,
        empresaIds: form.empresaIds,
      };
      if (form.password) payload.password = form.password;
      await usersApi.update(props.user.id, payload);
      $q.notify({ type: 'positive', message: 'Usuario y permisos actualizados' });
    } else {
      await usersApi.create({
        name: form.name,
        email: form.email,
        password: form.password,
        empresaIds: form.empresaIds,
      });
      $q.notify({ type: 'positive', message: 'Usuario creado con permisos asignados' });
    }
    emit('saved');
    emit('update:modelValue', false);
  } catch (err: any) {
    $q.notify({ type: 'negative', message: err.response?.data?.message || 'Error al guardar' });
  } finally {
    loading.value = false;
  }
}
</script>
