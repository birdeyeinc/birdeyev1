import React, { useState } from 'react';
import FreeMediaLibraryModal from './index';

export default {
  title: 'Modules/FreeMedia/FreeMediaLibraryModal',
  component: FreeMediaLibraryModal,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onClose: { action: 'onClose' },
    onSourceChange: { action: 'onSourceChange' },
    handleMultipleSelectChange: { action: 'handleMultipleSelectChange' },
  },
};

// --- Mock Data ---
const mockSources = [
  { key: 'Pexels', label: 'Pexels', icon: 'https://images.pexels.com/lib/api/pexels-white.png' },
  { key: 'Giphy', label: 'Giphy', icon: 'https://giphy.com/static/img/favicon.png' },
  { key: 'Pixabay', label: 'Pixabay', icon: 'https://pixabay.com/static/img/logo_square.png' },
];

const mockMedia = [
  {
    id: 1,
    photographer: 'John Doe',
    user: 'johndoe',
    user_id: '123',
    src: { large: 'https://picsum.photos/800/600?random=1', small: 'https://picsum.photos/200/150?random=1' },
    images: { 
        fixed_height: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcaOlfKDu/giphy.gif' },
        preview_gif: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqYnJtYmU0Z3BqJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxcaOlfKDu/giphy-preview.gif' }
    },
    largeImageURL: 'https://picsum.photos/800/600?random=1',
    previewURL: 'https://picsum.photos/200/150?random=1'
  }
];

// --- Template ---
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSource, setActiveSource] = useState(args.activeSource || 'Pexels');
  const [selected, setSelected] = useState([]);

  const handleSourceChange = (key) => {
    setActiveSource(key);
    args.onSourceChange(key);
  };

  const handleSelect = (item, isChecked) => {
    if (isChecked) {
      setSelected([...selected, item]);
    } else {
      setSelected(selected.filter((i) => i.id !== item.id));
    }
    args.handleMultipleSelectChange(item, isChecked);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={{ margin: '20px' }}>
        Open Free Media Library
      </button>
      <FreeMediaLibraryModal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeSource={activeSource}
        onSourceChange={handleSourceChange}
        freeMediaSelected={selected}
        selectedCount={selected.length}
        handleMultipleSelectChange={handleSelect}
        renderHeader={() => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h2 style={{ margin: 0 }}>Free Media Library</h2>
            <input type="text" placeholder="Search for high quality images..." style={{ padding: '8px', width: '300px' }} />
          </div>
        )}
        renderFooter={() => (
          <div className="footer">
             <div className="footer-sub">
                Selected {selected.length} of {args.maxFilesAllowed || 10}
             </div>
             <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsOpen(false)} style={{ padding: '8px 16px' }}>Cancel</button>
                <button style={{ padding: '8px 16px', backgroundColor: '#6834b7', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Insert Images
                </button>
             </div>
          </div>
        )}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  sources: mockSources,
  maxFilesAllowed: 10,
  showSelectedCount: true,
  pexelsProps: { photos: mockMedia, isLoading: false, hasMore: true },
  giphyProps: { gifs: mockMedia, isLoading: false, hasMore: true },
  pixabayProps: { photos: mockMedia, isLoading: false, hasMore: true },
};

export const InitialLoading = Template.bind({});
InitialLoading.args = {
  ...Default.args,
  pexelsProps: { photos: [], isLoading: true },
  giphyProps: { gifs: [], isLoading: true },
  pixabayProps: { photos: [], isLoading: true },
};

export const EmptyState = Template.bind({});
EmptyState.args = {
  ...Default.args,
  pexelsProps: { photos: [], noResults: true },
  noResultImage: "https://via.placeholder.com/150?text=No+Results+Found",
};

export const NoNavigation = Template.bind({});
NoNavigation.args = {
  ...Default.args,
  hideLeftNav: true,
};