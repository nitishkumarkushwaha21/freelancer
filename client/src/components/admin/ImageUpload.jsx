import { useRef, useState } from 'react';
import { uploadImage } from '../../api/admin';

/**
 * Drop-in replacement for the plain "Image URL" text input.
 *
 * Props:
 *   value    — current imageUrl string
 *   onChange — called with the new URL string after a successful upload
 */
export default function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e) {
    handleFile(e.target.files[0]);
    // reset so the same file can be re-selected if needed
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  function handleRemove() {
    onChange('');
  }

  return (
    <div className="image-upload">
      {value ? (
        <div className="image-upload-preview">
          <img src={value} alt="Preview" className="image-upload-img" />
          <button
            type="button"
            className="image-upload-remove"
            onClick={handleRemove}
            title="Remove image"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className={`image-upload-drop${uploading ? ' image-upload-drop--busy' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {uploading ? (
            <span className="image-upload-spinner">Uploading…</span>
          ) : (
            <>
              <span className="image-upload-icon">↑</span>
              <span>Click or drag an image here</span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />

      {error && <p className="image-upload-error">{error}</p>}

      {/* Allow pasting a URL as a fallback */}
      <input
        type="url"
        className="image-upload-url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL…"
      />
    </div>
  );
}
