'use client';

let toastContainer: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement('div');
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('role', 'status');
    toastContainer.style.cssText =
      'position:fixed;bottom:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

const variantStyles: Record<string, string> = {
  success: 'background:#059669;color:#fff;',
  error: 'background:#dc2626;color:#fff;',
  info: 'background:#2563eb;color:#fff;',
};

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const container = getContainer();

  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.style.cssText = `${variantStyles[type] || variantStyles.info}padding:0.75rem 1.25rem;border-radius:0.5rem;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:0.875rem;line-height:1.4;pointer-events:auto;opacity:0;transform:translateY(0.5rem);transition:opacity 0.3s ease,transform 0.3s ease;max-width:22rem;word-break:break-word;`;
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(0.5rem)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3000);
}
