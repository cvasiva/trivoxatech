import React from 'react';

const RenderContentBlock = ({ block, className, renderers = {} }) => {
  if (!block) return null;
  const { type = 'paragraph' } = block;
  if (renderers[type]) return renderers[type](block);

  switch (type) {
    case 'heading':
      return <h2 className={className}>{block.text}</h2>;
    case 'subheading':
      return <h3 className={className}>{block.text}</h3>;
    case 'paragraph':
      return <p className={className}>{block.text}</p>;
    case 'list':
      return <ul className={className}>{(block.items || []).map((it, i) => <li key={i}>{it}</li>)}</ul>;
    case 'image':
      return <img src={block.src} alt={block.alt || ''} className={className} />;
    case 'raw':
      return <div className={className} dangerouslySetInnerHTML={{ __html: block.html }} />;
    default:
      return <p className={className}>{block.text ?? JSON.stringify(block)}</p>;
  }
};

const RenderContent = ({ data, className, renderers }) => {
  if (data == null) return null;
  if (typeof data === 'string' || typeof data === 'number') {
    return <p className={className}>{data}</p>;
  }
  if (Array.isArray(data)) {
    return <>
      {data.map((block, idx) => (
        <RenderContentBlock key={idx} block={block} className={className} renderers={renderers} />
      ))}
    </>;
  }
  return <RenderContentBlock block={data} className={className} renderers={renderers} />;
};

export default RenderContent;
