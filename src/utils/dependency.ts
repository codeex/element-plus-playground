import { gte } from 'semver'
import type { Versions } from '@/composables/store'
import type { ImportMap } from '@vue/repl'
import type { MaybeRef } from '@vueuse/core'
import type { Ref } from 'vue'

export interface Dependency {
  pkg?: string
  version?: string
  path: string
}

export type Cdn = 'unpkg' | 'jsdelivr' | 'jsdelivr-fastly'
export const cdn = useLocalStorage<Cdn>('setting-cdn', 'jsdelivr')

export const genCdnLink = (
  pkg: string,
  version: string | undefined,
  path: string,
) => {
  version = version ? `@${version}` : ''
  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'jsdelivr-fastly':
      return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'unpkg':
      return `https://unpkg.com/${pkg}${version}${path}`
  }
}

export const genCompilerSfcLink = (version: string) => {
  return genCdnLink(
    '@vue/compiler-sfc',
    version,
    '/dist/compiler-sfc.esm-browser.js',
  )
}

export const genImportMap = ({ vue, fabric }: Partial<Versions> = {}): ImportMap => {
  const deps: Record<string, Dependency> = {
    vue: {
      pkg: '@vue/runtime-dom',
      version: vue,
      path: '/dist/runtime-dom.esm-browser.js',
    },
    '@vue/shared': {
      version: vue,
      path: '/dist/shared.esm-bundler.js',
    },
    fabric: {
      pkg: 'fabric',
      version: fabric,
      path: '/dist/fabric.min.mjs',
    },
  }

  return {
    imports: Object.fromEntries(
      Object.entries(deps).map(([key, dep]) => [
        key,
        genCdnLink(dep.pkg ?? key, dep.version, dep.path),
      ]),
    ),
  }
}

export const getVersions = (pkg: MaybeRef<string>) => {
  const url = computed(
    () => `https://data.jsdelivr.com/v1/package/npm/${unref(pkg)}`,
  )
  return useFetch(url, {
    initialData: [],
    afterFetch: (ctx) => ((ctx.data = ctx.data.versions), ctx),
    refetch: true,
  }).json<string[]>().data as Ref<string[]>
}

export const getSupportedVueVersions = () => {
  const versions = getVersions('vue')
  return computed(() =>
    versions.value.filter((version) => gte(version, '3.5.0')),
  )
}

export const getSupportedTSVersions = () => {
  const versions = getVersions('typescript')
  return computed(() =>
    versions.value.filter(
      (version) =>
        !version.includes('dev') &&
        !version.includes('beta') &&
        !version.includes('rc') &&
        !version.includes('insiders') &&
        gte(version, '3.5.0'),
    ),
  )
}

export const getSupportedFabricVersions = () => {
  const versions = getVersions('fabric')
  return computed(() => {
    return versions.value.filter((version) => gte(version, '6.0.0'))
  })
}
