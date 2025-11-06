// 'use client';

// import { useFileUpload } from '@/hooks/use-file-upload';
// import { Button } from '@/components/ui/button';
// import { CircleUserRoundIcon } from 'lucide-react';

// export default function Component() {
//   const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
//     accept: 'image/*',
//   });

//   const previewUrl = files[0]?.preview || null;
//   const fileName = files[0]?.file.name || null;

//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div className="inline-flex items-center gap-2 align-top">
//         <div
//           className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
//           aria-label={previewUrl ? 'Preview of uploaded image' : 'Default user avatar'}
//         >
//           {previewUrl ? (
//             <img
//               className="size-full object-cover"
//               src={previewUrl}
//               alt="Preview of uploaded image"
//               width={32}
//               height={32}
//             />
//           ) : (
//             <div aria-hidden="true">
//               <CircleUserRoundIcon className="opacity-60" size={16} />
//             </div>
//           )}
//         </div>
//         <div className="relative inline-block">
//           <Button onClick={openFileDialog} aria-haspopup="dialog">
//             {fileName ? 'Change image' : 'Upload image'}
//           </Button>
//           <input {...getInputProps()} className="sr-only" aria-label="Upload image file" tabIndex={-1} />
//         </div>
//       </div>
//       {fileName ? (
//         <div className="inline-flex gap-2 text-xs">
//           <p className="text-muted-foreground truncate" aria-live="polite">
//             {fileName}
//           </p>{' '}
//           <button
//             onClick={() => removeFile(files[0]?.id)}
//             className="cursor-pointer text-destructive font-medium hover:underline"
//             aria-label={`Remove ${fileName}`}
//           >
//             Remove
//           </button>
//         </div>
//       ) : (
//         <div className="inline-flex gap-2 text-xs">
//           <p className="text-muted-foreground truncate" aria-live="polite">
//             No image attached
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { CircleUserRoundIcon } from "lucide-react";

interface OfferImageUploadProps {
  value: string; // current image (base64 or path)
  operator?: string;
  onChange: (image: string) => void;
}

export default function OfferImageUpload({ value, operator, onChange }: OfferImageUploadProps) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*",
  });

  
  // If user selects a new file, read it as base64
  useEffect(() => {
    if (files.length > 0) {
      const file = files[0].file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onChange(base64);
      };
      reader.readAsDataURL(file);
    }
  }, [files, onChange]);

  // Preview: either the selected file, or the current offerForm.image (if editing)
  const previewUrl = files[0]?.preview || (value?.startsWith("data:") ? value : null);
  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="inline-flex items-center gap-2 align-top">
        <div
          className="border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
          aria-label={previewUrl ? "Preview of uploaded image" : "Default user avatar"}
        >
          {previewUrl ? (
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Preview"
              width={32}
              height={32}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="opacity-60" size={16} />
            </div>
          )}
        </div>

        <div className="relative inline-block">
          <Button className="bg-[#0D5256]" type="button" onClick={openFileDialog}>
            {fileName || value ? "Change image" : "Upload image"}
          </Button>
          <input {...getInputProps()} className="sr-only" />
        </div>
      </div>

      {fileName || value ? (
        <div className="inline-flex gap-2 text-xs">
          <p className="text-muted-foreground truncate" aria-live="polite">
            {fileName || `Default ${operator} image`}
          </p>
          <button
            type="button"
            onClick={() => {
              removeFile(files[0]?.id);
              // Restore default operator image
              setTimeout(() => {
                const defaultImg =
                  operator === "Djezzy"
                    ? "/Djezzy-red.png"
                    : operator === "Mobilis"
                    ? "/Mobilis-white.png"
                    : "/Ooredoo-white.png";
                onChange(defaultImg);
              }, 50);
            }}
            className="cursor-pointer text-destructive font-medium hover:underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No image attached</p>
      )}
    </div>
  );
}
