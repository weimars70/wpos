<template>
  <q-dialog v-model="open" persistent>
    <q-card style="min-width: 420px; max-width: 520px; width: 100%">
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
            type="password"
            :label="isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'"
            outlined
            lazy-rules
            :rules="isEdit
              ? [v => !v || v.length >= 6 || 'Mínimo 6 caracteres']
              : [v => !!v || 'Requerido', v => v.length >= 6 || 'Mínimo 6 caracteres']"
          >
            <template #prepend><q-icon name="lock" /></template>
          </q-input>
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
import { ref, reactive, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { usersApi, User } from 'src/api/users';

const props = defineProps<{ modelValue: boolean; user: User | null }>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'saved'): void;
}>();

const $q = useQuasar();
const formRef = ref();
const loading = ref(false);
const isEdit = computed(() => !!props.user);

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const form = reactive({ name: '', email: '', password: '' });

watch(() => props.user, (u) => {
  form.name = u?.name || '';
  form.email = u?.email || '';
  form.password = '';
}, { immediate: true });

async function handleSave() {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    if (isEdit.value && props.user) {
      const payload: any = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await usersApi.update(props.user.id, payload);
      $q.notify({ type: 'positive', message: 'Usuario actualizado' });
    } else {
      await usersApi.create({ name: form.name, email: form.email, password: form.password });
      $q.notify({ type: 'positive', message: 'Usuario creado' });
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
