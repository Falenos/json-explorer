import { useState } from 'react';

function useClipboard(ref: React.RefObject<HTMLElement>) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (ref.current) {
      const textToCopy = ref.current.textContent || ''; // Extract the text content
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000); // Reset the "Copied" state after 2 seconds
    }
  };

  return { copied, copyToClipboard };
}

export default useClipboard;
