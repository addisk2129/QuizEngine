import React from 'react'

function Modal() {
  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
    <div class="flex items-center gap-3 text-amber-600 mb-4">
      <i class="fas fa-exclamation-triangle text-2xl"></i>
      <h3 class="text-xl font-bold">Submit Quiz?</h3>
    </div>
    
    <div class="mb-6">
      <p class="text-gray-700 mb-2">
        <strong>⚠️ Once submitted, you cannot change your answers.</strong>
      </p>
      <p class="text-gray-600 text-sm">
        Please review all answers before final submission.
      </p>
    </div>

    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
      <p class="text-amber-800 text-sm flex items-center gap-2">
        <i class="fas fa-clock"></i>
        You have <span class="font-bold">5 unanswered</span> questions
      </p>
    </div>

    <div class="flex gap-3">
      <button class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
       Cancel
      </button>
      <button class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
        Yes, Submit
      </button>
    </div>
  </div>
</div>
  )
}

export default Modal
