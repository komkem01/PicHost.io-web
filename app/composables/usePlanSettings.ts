export interface PlanSettings {
  key: string
  name: string
  monthlyPrice: number
  storageLimitBytes: number
  imageLimit: number
  maxUploadMb: number
  isEnabled: boolean
  allowPrivate: boolean
  features: {
    customDomain: boolean
    apiAccess: boolean
    prioritySupport: boolean
    noAds: boolean
    watermarkRemoval: boolean
  }
}

const DEFAULTS: Record<string, PlanSettings> = {
  free: {
    key: 'free',
    name: 'Free',
    monthlyPrice: 0,
    storageLimitBytes: 1 * 1024 * 1024 * 1024,
    imageLimit: 200,
    maxUploadMb: 5,
    isEnabled: true,
    allowPrivate: false,
    features: {
      customDomain: false,
      apiAccess: false,
      prioritySupport: false,
      noAds: false,
      watermarkRemoval: false,
    },
  },
  basic: {
    key: 'basic',
    name: 'Basic',
    monthlyPrice: 149,
    storageLimitBytes: 20 * 1024 * 1024 * 1024,
    imageLimit: 5000,
    maxUploadMb: 20,
    isEnabled: true,
    allowPrivate: true,
    features: {
      customDomain: true,
      apiAccess: false,
      prioritySupport: false,
      noAds: true,
      watermarkRemoval: true,
    },
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    monthlyPrice: 399,
    storageLimitBytes: 100 * 1024 * 1024 * 1024,
    imageLimit: 50000,
    maxUploadMb: 64,
    isEnabled: true,
    allowPrivate: true,
    features: {
      customDomain: true,
      apiAccess: true,
      prioritySupport: true,
      noAds: true,
      watermarkRemoval: true,
    },
  },
  enterprise: {
    key: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 1499,
    storageLimitBytes: 500 * 1024 * 1024 * 1024,
    imageLimit: 500000,
    maxUploadMb: 256,
    isEnabled: true,
    allowPrivate: true,
    features: {
      customDomain: true,
      apiAccess: true,
      prioritySupport: true,
      noAds: true,
      watermarkRemoval: true,
    },
  },
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function normalizePlanKey(plan: string | null | undefined) {
  const key = (plan ?? '').trim().toLowerCase()
  return key || 'unknown'
}

export function usePlanSettings() {
  const { listPlanSettings, updatePlanSetting, deletePlanSetting } = useAdmin()
  const settings = useState<Record<string, PlanSettings>>('admin-plan-settings', () => ({}))
  const keys = useState<string[]>('admin-plan-settings-keys', () => [])
  const loaded = useState<boolean>('admin-plan-settings-loaded', () => false)
  const loading = useState<boolean>('admin-plan-settings-loading', () => false)

  async function load() {
    if (loading.value) return
    loading.value = true
    try {
      const rows = await listPlanSettings()
      const mapped = rows.map((row) => ({
        key: row.plan_key,
        name: row.display_name,
        monthlyPrice: row.monthly_price_thb,
        storageLimitBytes: row.storage_limit_bytes,
        imageLimit: row.image_limit,
        maxUploadMb: row.max_upload_mb,
        isEnabled: row.is_enabled,
        allowPrivate: row.allow_private,
        features: {
          customDomain: row.custom_domain,
          apiAccess: row.api_access,
          prioritySupport: row.priority_support,
          noAds: row.no_ads,
          watermarkRemoval: row.watermark_removal,
        },
      }))
      settings.value = Object.fromEntries(mapped.map((m) => [m.key, m]))
      keys.value = mapped.map((m) => m.key)
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  function ensureLoaded() {
    if (loaded.value || loading.value) return
    void load()
  }

  function list() {
    ensureLoaded()
    return keys.value
      .map((key) => settings.value[key])
      .filter((item): item is PlanSettings => !!item)
      .sort((a, b) => a.monthlyPrice - b.monthlyPrice)
  }

  function get(plan: string) {
    ensureLoaded()
    const key = normalizePlanKey(plan)
    return settings.value[key]
  }

  async function upsert(plan: string, patch: Partial<PlanSettings>) {
    ensureLoaded()
    const key = normalizePlanKey(plan)
    const current = settings.value[key] ?? {
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      monthlyPrice: 0,
      storageLimitBytes: 0,
      imageLimit: 0,
      maxUploadMb: 0,
      isEnabled: true,
      allowPrivate: false,
      features: {
        customDomain: false,
        apiAccess: false,
        prioritySupport: false,
        noAds: false,
        watermarkRemoval: false,
      },
    }

    settings.value[key] = {
      ...current,
      ...patch,
      key,
      features: {
        ...current.features,
        ...(patch.features ?? {}),
      },
    }
    if (!keys.value.includes(key)) {
      keys.value = [...keys.value, key]
    }

    const payload = {
      display_name: settings.value[key].name,
      monthly_price_thb: settings.value[key].monthlyPrice,
      storage_limit_bytes: settings.value[key].storageLimitBytes,
      image_limit: settings.value[key].imageLimit,
      max_upload_mb: settings.value[key].maxUploadMb,
      is_enabled: settings.value[key].isEnabled,
      allow_private: settings.value[key].allowPrivate,
      custom_domain: settings.value[key].features.customDomain,
      api_access: settings.value[key].features.apiAccess,
      priority_support: settings.value[key].features.prioritySupport,
      no_ads: settings.value[key].features.noAds,
      watermark_removal: settings.value[key].features.watermarkRemoval,
    }
    await updatePlanSetting(key, payload)
  }

  async function resetAll() {
    const resetMap: Record<string, PlanSettings> = {}
    for (const key of keys.value) {
      const base = DEFAULTS[key] ?? {
        key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        monthlyPrice: 0,
        storageLimitBytes: 0,
        imageLimit: 0,
        maxUploadMb: 0,
        isEnabled: true,
        allowPrivate: false,
        features: {
          customDomain: false,
          apiAccess: false,
          prioritySupport: false,
          noAds: false,
          watermarkRemoval: false,
        },
      }
      resetMap[key] = deepClone(base)
    }

    settings.value = resetMap
    for (const [key, value] of Object.entries(resetMap)) {
      await updatePlanSetting(key, {
        display_name: value.name,
        monthly_price_thb: value.monthlyPrice,
        storage_limit_bytes: value.storageLimitBytes,
        image_limit: value.imageLimit,
        max_upload_mb: value.maxUploadMb,
        is_enabled: value.isEnabled,
        allow_private: value.allowPrivate,
        custom_domain: value.features.customDomain,
        api_access: value.features.apiAccess,
        priority_support: value.features.prioritySupport,
        no_ads: value.features.noAds,
        watermark_removal: value.features.watermarkRemoval,
      })
    }
  }

  async function remove(plan: string) {
    const key = normalizePlanKey(plan)
    await deletePlanSetting(key)
    const next = { ...settings.value }
    delete next[key]
    settings.value = next
    keys.value = keys.value.filter((k) => k !== key)
  }

  return {
    normalizePlanKey,
    load,
    list,
    get,
    upsert,
    resetAll,
    remove,
  }
}
