import {useRef, useState} from 'react';
import {ImageIcon, LoaderCircle, Upload, X} from 'lucide-react';
import {supabase} from '@/src/lib/supabase';
import {cn} from '@/src/lib/utils';

type Props = {
  bucket: string;
  pathPrefix: string; // e.g. "userId/invitationId/"
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
  accept?: string;
};

export function PhotoUpload({
  bucket,
  pathPrefix,
  currentUrl,
  onUploaded,
  label = 'Upload photo',
  accept = 'image/*',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);

    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${pathPrefix}${Date.now()}.${ext}`;

    const {error: uploadError} = await supabase.storage
      .from(bucket)
      .upload(path, file, {upsert: true});

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {data} = supabase.storage.from(bucket).getPublicUrl(path);
    const url = data.publicUrl;
    setPreview(url);
    onUploaded(url);
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void upload(file);
  };

  return (
    <div className="space-y-2">
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">{label}</span>

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-[#e8ddd4]">
          <img src={preview} alt="preview" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (inputRef.current) inputRef.current.value = '';
            }}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {e.preventDefault(); setDragging(true);}}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={cn(
            'flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition',
            dragging
              ? 'border-[#c9974a] bg-[#fdf5eb]'
              : 'border-[#e8ddd4] bg-[#fdfaf6] hover:border-[#c9974a]/60',
          )}
        >
          {uploading ? (
            <LoaderCircle className="h-5 w-5 animate-spin text-[#c9974a]" />
          ) : (
            <>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4ede3]">
                {dragging ? (
                  <Upload className="h-4 w-4 text-[#c9974a]" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-[#c9974a]" />
                )}
              </div>
              <span className="text-xs text-[#8a7a6e]">
                {dragging ? 'Drop to upload' : 'Click or drag to upload'}
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
