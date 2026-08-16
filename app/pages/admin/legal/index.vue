<template>
  <div class="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <svg class="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span>Legal Documents & Policies</span>
        </h1>
        <p class="text-xs text-zinc-500 mt-1">Manage Terms of Service, Privacy Policy, and legal compliance pages.</p>
      </div>
      
      <div class="flex items-center gap-3">
        <button
          @click="fetchDocs"
          class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 transition shadow-xs cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-zinc-500" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>Refresh</span>
        </button>

        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Document</span>
        </button>
      </div>
    </div>

    <!-- Documents List -->
    <div v-if="loading" class="text-center py-20 text-zinc-400 text-xs flex flex-col items-center gap-2">
      <svg class="w-6 h-6 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span>Loading documents...</span>
    </div>

    <div v-else-if="documents.length === 0" class="text-center py-20 bg-white rounded-2xl border border-zinc-200 text-zinc-400 text-xs">
      No legal documents found.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="doc in documents"
        :key="doc.key"
        class="bg-white rounded-2xl border border-zinc-200 shadow-card p-6 flex flex-col justify-between hover:border-zinc-300 transition"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-semibold bg-zinc-100 text-zinc-700 uppercase border border-zinc-200">
              Key: {{ doc.key }}
            </span>
            <span class="text-[11px] text-zinc-400 tabular-nums">
              Updated: {{ formatDate(doc.updated_at) }}
            </span>
          </div>

          <h2 class="text-base font-bold text-zinc-900 tracking-tight">{{ doc.title }}</h2>
          <p class="text-xs text-zinc-500 line-clamp-4 whitespace-pre-line leading-relaxed font-sans bg-zinc-50 p-3 rounded-xl border border-zinc-100">
            {{ doc.content }}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <a
            :href="`/${doc.key}`"
            target="_blank"
            class="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 font-medium"
          >
            <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            <span>View Live Page</span>
          </a>

          <div class="flex items-center gap-2">
            <button
              @click="openEditModal(doc)"
              class="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-xs font-semibold transition cursor-pointer"
            >
              Edit
            </button>
            <button
              @click="openDeleteModal(doc)"
              class="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit / Create Modal Popup -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs" @click.self="showModal = false">
        <div class="relative w-full max-w-2xl bg-white rounded-2xl border border-zinc-200 shadow-2xl p-6 space-y-5">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 class="text-base font-bold text-zinc-900">
              {{ isEditing ? 'Edit Legal Document' : 'Create Legal Document' }}
            </h3>
            <button @click="showModal = false" class="text-zinc-400 hover:text-zinc-600 cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-4 text-xs">
            <!-- Inline Form Error Banner -->
            <div v-if="formError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <span>{{ formError }}</span>
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 mb-1">Document Key (Slug)</label>
              <input
                v-model="form.key"
                :disabled="isEditing"
                type="text"
                placeholder="e.g. terms, privacy, cookie-policy"
                class="w-full px-3.5 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:bg-zinc-100 text-xs font-mono"
                @input="formError = ''"
              />
              <span class="text-[10.5px] text-zinc-400 mt-1 block">Used as URL slug (e.g. /terms or /privacy).</span>
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 mb-1">Document Title</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. Terms of Service / ข้อตกลงและเงื่อนไขการให้บริการ"
                class="w-full px-3.5 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-xs font-medium"
                @input="formError = ''"
              />
            </div>

            <div>
              <label class="block font-semibold text-zinc-700 mb-1">Content (Markdown / Text)</label>
              <textarea
                v-model="form.content"
                rows="12"
                placeholder="Enter document clauses and policy text here..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-xs font-sans leading-relaxed"
                @input="formError = ''"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              @click="showModal = false"
              class="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="saveDoc"
              :disabled="saving"
              class="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            >
              <svg v-if="saving" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal Popup -->
    <Teleport to="body">
      <div v-if="showDeleteModal && docToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs" @click.self="showDeleteModal = false">
        <div class="relative w-full max-w-[400px] rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6 text-center space-y-4">
          <!-- Danger Icon -->
          <div class="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="text-base font-bold text-zinc-900">Delete Legal Document?</h3>
            <p class="text-xs text-zinc-500 leading-relaxed">
              Are you sure you want to delete <span class="font-semibold font-mono text-zinc-900">"{{ docToDelete.key }}"</span> ({{ docToDelete.title }})? This action cannot be undone.
            </p>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              @click="showDeleteModal = false"
              class="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="executeDeleteDoc"
              :disabled="deleting"
              class="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              <svg v-if="deleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Delete Now</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { t } = useI18n()
const { success: toastSuccess, error: toastError } = useToast()

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

interface LegalDoc {
  key: string
  title: string
  content: string
  updated_at: string
}

const documents = ref<LegalDoc[]>([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

const showModal = ref(false)
const isEditing = ref(false)
const formError = ref('')

const showDeleteModal = ref(false)
const docToDelete = ref<LegalDoc | null>(null)

const form = ref({
  key: '',
  title: '',
  content: ''
})

const defaultTermsContent = `By accessing or using PicHost.io, you agree to be bound by these Terms of Service.
การเข้าใช้บริการ PicHost.io ถือว่าท่านได้ยอมรับข้อตกลงและเงื่อนไขการให้บริการนี้แล้ว

1. Acceptance of Terms / การยอมรับข้อตกลง
By accessing or using PicHost.io, you agree to be bound by these Terms of Service.
การเข้าใช้บริการ PicHost.io ถือว่าท่านได้ยอมรับข้อตกลงและเงื่อนไขการให้บริการนี้แล้ว

2. Acceptable Use & Content Policy / นโยบายการใช้งานและเนื้อหา
Illegal content, malware, phishing, and copyrighted content violations are strictly prohibited.
ห้ามใช้อัปโหลดไฟล์ที่ผิดกฎหมาย สื่อลามกอนาจาร ไวรัส/มัลแวร์ หรือไฟล์ละเมิดลิขสิทธิ์

3. Account Termination / การยกเลิกบัญชี
We reserve the right to suspend or terminate accounts that violate our terms of service without prior notice.`

const defaultPrivacyContent = `We collect account email, username, uploaded image files, and security access logs strictly for operating PicHost.io.
เราจัดเก็บอีเมล ชื่อผู้ใช้ ภาพที่ถูกอัปโหลด และประวัติบันทึกความปลอดภัยเฉพาะที่จำเป็นสำหรับการให้บริการเท่านั้น

1. Information We Collect / ข้อมูลที่เราจัดเก็บ
We collect account email, username, uploaded image files, and security access logs strictly for operating PicHost.io.
เราจัดเก็บอีเมล ชื่อผู้ใช้ ภาพที่ถูกอัปโหลด และประวัติบันทึกความปลอดภัยเฉพาะที่จำเป็นสำหรับการให้บริการเท่านั้น

2. Data Protection & PDPA / การคุ้มครองข้อมูลส่วนบุคคล
We protect your data according to Thailand PDPA standards. Your personal data is never sold to third parties.`

async function fetchDocs() {
  loading.value = true
  try {
    const res = await apiFetch<any>('/admin/legal')
    if (res.data) {
      documents.value = res.data || []
    }
  } catch (e) {
    console.error('Failed to load legal documents:', e)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  isEditing.value = false
  formError.value = ''
  form.value = { key: '', title: '', content: '' }
  showModal.value = true
}

function openEditModal(doc: LegalDoc) {
  isEditing.value = true
  formError.value = ''
  let content = (doc.content || '').trim()
  if (!content) {
    if (doc.key === 'terms') content = defaultTermsContent
    if (doc.key === 'privacy') content = defaultPrivacyContent
  }
  let title = (doc.title || '').trim()
  if (!title) {
    if (doc.key === 'terms') title = 'Terms of Service / ข้อตกลงและเงื่อนไขการให้บริการ'
    if (doc.key === 'privacy') title = 'Privacy Policy / นโยบายความเป็นส่วนตัว'
  }
  form.value = { key: doc.key, title, content }
  showModal.value = true
}

async function saveDoc() {
  formError.value = ''
  const key = form.value.key.trim()
  const title = form.value.title.trim()
  const content = form.value.content.trim()

  if (!key || !title || !content) {
    formError.value = 'กรุณากรอกข้อมูล Key, Title และ Content ให้ครบถ้วน'
    return
  }

  saving.value = true
  try {
    await apiFetch(`/admin/legal/${key}`, {
      method: 'PUT',
      body: { key, title, content }
    })
    showModal.value = false
    toastSuccess(t('toast.saveSuccess'))
    fetchDocs()
  } catch (e) {
    formError.value = t('toast.saveError')
  } finally {
    saving.value = false
  }
}

function openDeleteModal(doc: LegalDoc) {
  docToDelete.value = doc
  showDeleteModal.value = true
}

async function executeDeleteDoc() {
  if (!docToDelete.value) return
  deleting.value = true
  try {
    await apiFetch(`/admin/legal/${docToDelete.value.key}`, { method: 'DELETE' })
    showDeleteModal.value = false
    docToDelete.value = null
    toastSuccess(t('toast.deleteSuccess'))
    fetchDocs()
  } catch (e) {
    toastError(t('toast.deleteError'))
  } finally {
    deleting.value = false
  }
}

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchDocs()
})
</script>
