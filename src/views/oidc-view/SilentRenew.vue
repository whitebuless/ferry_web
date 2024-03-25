<template>
  <q-page>
    <div class="fixed-center text-center">
      <p>
        <q-icon name="person" size="8em" color="grey-5" />
      </p>
      <p class="text-faded">Silent Renew Token</p>
      <p />
      <p class="text-faded">
        <strong>Please wait while we set up your information...</strong>
      </p>
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
