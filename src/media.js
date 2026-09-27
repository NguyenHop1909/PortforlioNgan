export const MAX_IMAGES = 12;
export function imageStyle(image) {
  return { objectFit: image?.fit || 'contain', objectPosition: `50% ${image?.position ?? 50}%`, background: image?.background || '#f5f3ee', borderRadius: `${image?.radius ?? 12}px` };
}
export async function prepareImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Chọn ảnh JPG, PNG hoặc WebP.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Ảnh tối đa 20 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const ratio = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const src = canvas.toDataURL('image/webp', 0.82);
    if (src.length > 1100000) throw new Error('Ảnh còn quá lớn sau khi tối ưu. Hãy chọn ảnh nhỏ hơn.');
    return { src, caption: '', alt: file.name.replace(/\.[^.]+$/, ''), fit: 'contain', position: 50, radius: 12, background: '#f5f3ee' };
  } finally { bitmap.close(); }
}
export function mediaItems(portfolio) {
  return [portfolio.personalInfo.portrait, ...portfolio.projects.flatMap(project => project.images || [])].filter(Boolean);
}
export async function stageMedia(draft, upload, onProgress) {
  const portfolio = structuredClone(draft);
  const pending = mediaItems(portfolio).filter(image => image.src.startsWith('data:'));
  const assets = [];
  for (let index = 0; index < pending.length; index++) {
    onProgress?.(`Đang tải ảnh ${index + 1}/${pending.length}…`);
    const asset = await upload(pending[index].src);
    pending[index].src = asset.src;
    assets.push(asset);
  }
  return { portfolio, assets };
}
