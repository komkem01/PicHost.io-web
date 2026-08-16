import Swal from 'sweetalert2'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

function getCurrentLang(): string {
  try {
    const nuxtApp = useNuxtApp()
    const loc = (nuxtApp as any)?.$i18n?.locale?.value
    if (loc === 'th' || loc === 'en') return loc
  } catch {}
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.lang
    if (htmlLang === 'th' || htmlLang === 'en') return htmlLang
  }
  return 'th'
}

/**
 * Bi-directional translation maps for toast notifications across the application.
 */
const toastTranslations: { th: Record<string, string>; en: Record<string, string> } = {
  th: {
    // Auth & Account
    'invalid_credentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'email_already_exists': 'อีเมลนี้ถูกลงทะเบียนไว้ในระบบแล้ว',
    'username_already_exists': 'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว',
    'user_not_found': 'ไม่พบบัญชีผู้ใช้นี้ในระบบ',
    'current_password_incorrect': 'รหัสผ่านปัจจุบันไม่ถูกต้อง',
    'token_expired': 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
    'token_invalid': 'ลิงก์ไม่ถูกต้องหรือหมดอายุแล้ว',
    'unauthorized': 'กรุณาเข้าสู่ระบบก่อนใช้งาน',
    'forbidden': 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้',
    'signed in successfully': 'เข้าสู่ระบบสำเร็จ',
    'sign-in failed. please try again.': 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
    'account created successfully': 'สมัครสมาชิกสำเร็จ',
    'link copied to clipboard': 'คัดลอกลิงก์เรียบร้อยแล้ว',
    'copied to clipboard': 'คัดลอกลงคลิปบอร์ดแล้ว',

    // Storage & Files
    'file_too_large': 'ขนาดไฟล์ใหญ่เกินที่กำหนด',
    'invalid_file_type': 'ประเภทไฟล์ไม่รองรับ',
    'storage_limit_exceeded': 'พื้นที่จัดเก็บเต็มแล้ว กรุณาอัปเกรดแพ็กเกจ',
    'image deleted successfully': 'ลบรูปภาพเรียบร้อยแล้ว',
    'failed to delete file': 'เกิดข้อผิดพลาดในการลบไฟล์',
    'failed to load dashboard data': 'ไม่สามารถโหลดข้อมูลสถิติได้',

    // Admin & Moderation
    'saved successfully': 'บันทึกข้อมูลเรียบร้อยแล้ว',
    'deleted successfully': 'ลบข้อมูลเรียบร้อยแล้ว',
    'failed to save': 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
    'failed to delete': 'เกิดข้อผิดพลาดในการลบข้อมูล',
    'user profile saved successfully': 'บันทึกการแก้ไขผู้ใช้สำเร็จ',
    'password reset successfully': 'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว',
    'user account suspended successfully': 'ระงับบัญชีผู้ใช้เรียบร้อยแล้ว',
    'plan conditions saved': 'บันทึกเงื่อนไขแพ็กเกจเรียบร้อยแล้ว',
    'plan created': 'สร้างแพ็กเกจเรียบร้อยแล้ว',
    'plan deleted': 'ลบแพ็กเกจเรียบร้อยแล้ว',
    'plan conditions reset to defaults': 'รีเซ็ตการตั้งค่าแพ็กเกจเป็นค่าเริ่มต้นเรียบร้อยแล้ว',
  },
  en: {
    // Auth & Account
    'invalid_credentials': 'Invalid email or password',
    'email_already_exists': 'This email is already registered',
    'username_already_exists': 'This username is already taken',
    'user_not_found': 'Account not found',
    'current_password_incorrect': 'Current password is incorrect',
    'token_expired': 'Session expired. Please sign in again.',
    'token_invalid': 'Link is invalid or has expired',
    'unauthorized': 'Please sign in first',
    'forbidden': 'You do not have permission to perform this action',
    'เข้าสู่ระบบสำเร็จ': 'Signed in successfully',
    'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง': 'Sign-in failed. Please try again.',
    'สมัครสมาชิกสำเร็จ': 'Account created successfully',
    'คัดลอกลิงก์เรียบร้อยแล้ว': 'Link copied to clipboard',
    'คัดลอกลงคลิปบอร์ดแล้ว': 'Copied to clipboard',

    // Storage & Files
    'file_too_large': 'File size exceeds limit',
    'invalid_file_type': 'File format not supported',
    'storage_limit_exceeded': 'Storage limit reached. Please upgrade your plan.',
    'ลบรูปภาพเรียบร้อยแล้ว': 'Image deleted successfully',
    'เกิดข้อผิดพลาดในการลบไฟล์': 'Failed to delete file',
    'ไม่สามารถโหลดข้อมูลสถิติได้': 'Failed to load dashboard data',

    // Admin & Moderation
    'บันทึกข้อมูลเรียบร้อยแล้ว': 'Saved successfully',
    'ลบข้อมูลเรียบร้อยแล้ว': 'Deleted successfully',
    'เกิดข้อผิดพลาดในการบันทึกข้อมูล': 'Failed to save data',
    'เกิดข้อผิดพลาดในการลบข้อมูล': 'Failed to delete data',
    'บันทึกการแก้ไขผู้ใช้สำเร็จ': 'User profile saved successfully',
    'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว': 'Password reset successfully',
    'ระงับบัญชีผู้ใช้เรียบร้อยแล้ว': 'User account suspended successfully',
    'รีเซ็ตการตั้งค่าแพ็กเกจเป็นค่าเริ่มต้นเรียบร้อยแล้ว': 'Plan conditions reset to defaults',
    'แก้ไขข้อมูลแพ็กเกจเรียบร้อยแล้ว': 'Plan updated successfully',
    'เปิดการสมัครแพ็กเกจเรียบร้อยแล้ว': 'Plan enabled successfully',
    'ปิดการสมัครแพ็กเกจเรียบร้อยแล้ว': 'Plan disabled successfully',
    'เกิดข้อผิดพลาดในการบันทึกแพ็กเกจ': 'Failed to save plan',
    'เกิดข้อผิดพลาดในการรีเซ็ตค่าเริ่มต้น': 'Failed to reset plan conditions',
  }
}

function translateMessage(rawMsg: string, lang: 'th' | 'en'): string {
  if (!rawMsg) {
    return lang === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' : 'An error occurred. Please try again.'
  }

  const cleanMsg = String(rawMsg).trim()
  const lowerMsg = cleanMsg.toLowerCase()

  // 1. Check direct match in dictionary
  const dict = toastTranslations[lang]
  if (dict[cleanMsg]) return dict[cleanMsg]
  if (dict[lowerMsg]) return dict[lowerMsg]

  // 2. Check network / fetch errors
  if (cleanMsg.includes('FetchError') || cleanMsg.includes('NetworkError') || cleanMsg.includes('Failed to fetch')) {
    return lang === 'th'
      ? 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'
      : 'Unable to connect to server. Please check your internet connection.'
  }

  return cleanMsg
}

// Clean SVG icons for each toast type
const toastIcons: Record<ToastType, string> = {
  success: `<svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  error: `<svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  warning: `<svg class="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>`,
  info: `<svg class="w-5 h-5 text-zinc-600 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>`,
}

// Global SweetAlert2 Toast Mixin configured for top-right placement
const ToastSwal = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: '!items-center !rounded-xl !border !border-zinc-200 !shadow-elevated !bg-white !text-zinc-900 !px-4 !py-3 font-sans',
    title: '!self-center !text-[13.5px] !font-medium !text-zinc-900 !m-0 !p-0 leading-snug',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  },
})

export function useToast() {
  function showToast(message: string, type: ToastType = 'info', duration = 3000) {
    if (typeof window === 'undefined') return

    const lang = getCurrentLang() as 'th' | 'en'
    let formattedMessage = message

    // If message is an i18n key (e.g. "toast.saveSuccess"), try resolving through $i18n.t
    try {
      const nuxtApp = useNuxtApp()
      const i18n = (nuxtApp as any)?.$i18n
      if (i18n && typeof i18n.t === 'function' && typeof message === 'string') {
        if (message.startsWith('toast.') || message.startsWith('common.') || message.startsWith('admin.') || message.startsWith('billing.') || message.startsWith('auth.')) {
          formattedMessage = i18n.t(message)
        }
      }
    } catch {}

    formattedMessage = translateMessage(formattedMessage, lang)

    ToastSwal.fire({
      iconHtml: toastIcons[type],
      title: formattedMessage,
      timer: duration,
    })
  }

  return {
    toasts: readonly(ref<Toast[]>([])),
    add: (msg: string, type: ToastType = 'info', duration?: number) => showToast(msg, type, duration),
    success: (msg: string, duration?: number) => showToast(msg, 'success', duration),
    error: (msg: string, duration?: number) => showToast(msg, 'error', duration),
    warning: (msg: string, duration?: number) => showToast(msg, 'warning', duration),
    info: (msg: string, duration?: number) => showToast(msg, 'info', duration),
    remove: () => {},
  }
}
