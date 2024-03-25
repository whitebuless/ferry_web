<template>
  <q-page>
    <div class="fixed-center text-center">
      <p>
        <!-- <q-icon name="person" size="8em" color="grey-5" /> -->
        <q-circular-progress
          indeterminate
          size="8em"
          :thickness="0.22"
          color="primary"
          track-color="grey-3"
          class="q-ma-md"
        />
      </p>
      <p class="text-h6 text-weight-regular">正在加载...</p>
      <p />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { $OidcMgr } from '../../utils/oidc'

onMounted(() => {
  try {
    $OidcMgr.call_back()
  } catch (e) {
    console.error(e)
  }
})
</script>
