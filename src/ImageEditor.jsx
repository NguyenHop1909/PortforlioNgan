import { useState } from 'react';
import { imageStyle, MAX_IMAGES, prepareImage } from './media';

export default function ImageEditor({ images, onChange, portrait = false, onBusy }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const limit = portrait ? 1 : MAX_IMAGES;
  async function add(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    setError('');
    if (!portrait && images.length + files.length > limit) { setError(`Mỗi dự án tối đa ${limit} ảnh.`); return; }
    setLoading(true); onBusy(true);
    try {
      const added = [];
      for (const file of files) added.push(await prepareImage(file));
      onChange(portrait ? added.slice(0, 1).map(image => ({ ...image, fit: 'cover' })) : [...images, ...added]);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); onBusy(false); }
  }
  function update(index, patch) { onChange(images.map((image, i) => i === index ? { ...image, ...patch } : image)); }
  function move(index, offset) {
    const next = [...images];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  }
  return <div className="image-editor">
    <label className="image-upload">{loading ? 'Đang xử lý ảnh…' : portrait ? 'Chọn / thay ảnh cá nhân' : 'Thêm ảnh thiết kế'}
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple={!portrait} onChange={add} disabled={loading} />
    </label>
    <p className="image-help">JPG, PNG, WebP · tối đa 20 MB/ảnh · tự tối ưu. {portrait ? 'Dùng ở phần mở đầu và giới thiệu.' : `Tối đa ${limit} ảnh; ảnh đầu tiên làm ảnh bìa dự án.`} Ảnh chỉ được tải lên khi bấm Lưu.</p>
    {error && <p role="alert" className="admin-error">{error}</p>}
    <div className="image-editor-list">{images.map((image, index) => <article className="image-editor-item" key={index}>
      <img src={image.src} alt={image.alt || 'Ảnh đang chỉnh'} style={imageStyle(image)} />
      <div className="editor-fields">
        <label>Mô tả ảnh<input value={image.alt || ''} onChange={event => update(index, { alt: event.target.value })} /></label>
        {!portrait && <label>Chú thích<input value={image.caption || ''} onChange={event => update(index, { caption: event.target.value })} /></label>}
        <label>Cách hiển thị<select value={image.fit || 'contain'} onChange={event => update(index, { fit: event.target.value })}><option value="contain">Hiện trọn ảnh</option><option value="cover">Lấp đầy khung</option></select></label>
        <label>Vị trí trong khung<input type="range" min="0" max="100" value={image.position ?? 50} onChange={event => update(index, { position: Number(event.target.value) })} /></label>
        <label>Bo góc: {image.radius ?? 12}px<input type="range" min="0" max="40" value={image.radius ?? 12} onChange={event => update(index, { radius: Number(event.target.value) })} /></label>
        <label>Màu nền<input type="color" value={image.background || '#f5f3ee'} onChange={event => update(index, { background: event.target.value })} /></label>
      </div>
      <div className="image-controls">
        {!portrait && <><button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Đưa ảnh ${index + 1} lên trước`}>← Lên trước</button><button type="button" disabled={index === images.length - 1} onClick={() => move(index, 1)} aria-label={`Đưa ảnh ${index + 1} ra sau`}>Ra sau →</button></>}
        <button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))}>{portrait ? 'Dùng lại ảnh mặc định' : 'Xóa ảnh'}</button>
      </div>
    </article>)}</div>
  </div>;
}
