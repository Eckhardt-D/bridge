import { installModule, useNuxt } from '@nuxt/kit'
import * as CompositionApi from '@vue/composition-api'
import type { Preset } from 'unimport'
import autoImports from './auto-imports/module'

const UnsupportedImports = new Set(['useAsyncData', 'useFetch', 'useError', 'throwError', 'clearError', 'defineNuxtLink', 'useActiveRoute'])
const CapiHelpers = new Set(Object.keys(CompositionApi))

export function setupAutoImports () {
  const nuxt = useNuxt()

  const bridgePresets: Preset[] = [{
    from: '@vue/composition-api',
    imports: vue3Keys.filter(i => CapiHelpers.has(i as string))
  }]

  nuxt.hook('autoImports:sources', (presets) => {
    const vuePreset = presets.find(p => p.from === 'vue')
    if (vuePreset) { vuePreset.disabled = true }

    const appPreset = presets.find(p => p.from === '#app')
    if (!appPreset) { return }

    for (const [index, i] of Object.entries(appPreset.imports).reverse()) {
      if (typeof i === 'string' && UnsupportedImports.has(i)) {
        appPreset.imports.splice(Number(index), 1)
      }
    }

    appPreset.imports.push('useNuxt2Meta')
  })

  nuxt.hook('modules:done', () => installModule(autoImports, { presets: bridgePresets }))
}

const vue3Keys = [
  // <script setup>
  'withCtx',
  'withDirectives',
  'withKeys',
  'withMemo',
  'withModifiers',
  'withScopeId',

  // Lifecycle
  'onActivated',
  'onBeforeMount',
  'onBeforeUnmount',
  'onBeforeUpdate',
  'onDeactivated',
  'onErrorCaptured',
  'onMounted',
  'onRenderTracked',
  'onRenderTriggered',
  'onServerPrefetch',
  'onUnmounted',
  'onUpdated',

  // Reactivity
  'computed',
  'customRef',
  'isProxy',
  'isReactive',
  'isReadonly',
  'isRef',
  'markRaw',
  'proxyRefs',
  'reactive',
  'readonly',
  'ref',
  'shallowReactive',
  'shallowReadonly',
  'shallowRef',
  'toRaw',
  'toRef',
  'toRefs',
  'triggerRef',
  'unref',
  'watch',
  'watchEffect',
  'isShallow',

  // effect
  'effect',
  'effectScope',
  'getCurrentScope',
  'onScopeDispose',

  // Component
  'defineComponent',
  'defineAsyncComponent',
  'resolveComponent',
  'getCurrentInstance',
  'h',
  'inject',
  'nextTick',
  'provide',
  'useAttrs',
  'useCssModule',
  'useCssVars',
  'useSlots',
  'useTransitionState'
]
