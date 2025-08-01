import { useState, useEffect, useRef } from 'react';

export default function ComponentPreview({ jsx, css }) {
  const previewRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [componentState, setComponentState] = useState({});

  useEffect(() => {
    if (!jsx || !css) {
      setError(null);
      setLoading(false);
      return;
    }

    // Reset component state when new JSX/CSS is received
    setComponentState({});

    console.log('ComponentPreview received:', {
      jsx: jsx.substring(0, 100) + '...',
      css: css.substring(0, 100) + '...',
      isCar: jsx.includes('car') || jsx.includes('Car'),
      isButton: jsx.includes('button') || jsx.includes('Button'),
      isNavbar: jsx.includes('Navbar') || (jsx.includes('nav') && jsx.includes('navbar')),
      componentName: jsx.match(/const\s+(\w+)\s*=/)?.[1] || 'Unknown'
    });

    setLoading(true);
    setError(null);

    try {
      const previewContainer = previewRef.current;
      if (!previewContainer) {
        setError('Preview container not available');
        setLoading(false);
        return;
      }

      // Clear previous content
      previewContainer.innerHTML = '';

      // Create a more sophisticated preview with React-like behavior
      const createAdvancedPreview = () => {
        // Add CSS styles with scoping
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .component-preview-container {
              padding: 20px;
            min-height: 200px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .component-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: center;
            justify-content: center;
            min-height: 150px;
          }
          .component-controls {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            flex-wrap: wrap;
          }
          .control-group {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          .control-group label {
            font-size: 12px;
            color: #666;
            min-width: 60px;
          }
          .control-group input, .control-group select {
            padding: 4px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
          }
          .control-group button {
            padding: 4px 8px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }
          .control-group button:hover {
            background: #0056b3;
            }
            ${css}
        `;
        previewContainer.appendChild(styleElement);

        // Create main container
        const container = document.createElement('div');
        container.className = 'component-preview-container';
        previewContainer.appendChild(container);

        // Create component wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'component-wrapper';
        container.appendChild(wrapper);

        // Extract component type and create interactive preview
        const componentName = jsx.match(/const\s+(\w+)\s*=/)?.[1] || 'Component';
        
        // Improved component detection with priority
        const isNavbar = jsx.includes('Navbar') || (jsx.includes('nav') && jsx.includes('navbar'));
        const isCar = jsx.includes('Car') || (jsx.includes('car') && !jsx.includes('navbar'));
        const isCard = jsx.includes('Card') || (jsx.includes('card') && !jsx.includes('navbar'));
        const isButton = jsx.includes('Button') || (jsx.includes('button') && !jsx.includes('navbar') && !jsx.includes('nav'));

        console.log('Component type detection:', {
          componentName,
          isButton,
          isCar,
          isCard,
          isNavbar,
          jsxSnippet: jsx.substring(0, 200)
        });

        if (isNavbar) {
          console.log('Creating Navbar component');
          createInteractiveNavbar(wrapper, componentState, setComponentState);
        } else if (isCar) {
          console.log('Creating Car component');
          createInteractiveCar(wrapper, componentState, setComponentState);
        } else if (isCard) {
          console.log('Creating Card component');
          createInteractiveCard(wrapper, componentState, setComponentState);
        } else if (isButton) {
          console.log('Creating Button component');
          createInteractiveButton(wrapper, componentState, setComponentState);
        } else {
          console.log('Creating Generic component');
          createGenericComponent(wrapper, componentName);
        }

        // Add component controls
        createComponentControls(container, componentState, setComponentState);
      };

      createAdvancedPreview();
      setLoading(false);

    } catch (err) {
      console.error('Preview setup error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [jsx, css, componentState]);

  // Interactive Button Component
  const createInteractiveButton = (wrapper, state, setState) => {
    const button = document.createElement('button');
    button.textContent = state.text || 'Click me!';
    button.className = `btn btn-${state.variant || 'primary'}`;
    button.style.fontSize = state.fontSize || '16px';
    button.style.padding = state.padding || '12px 24px';
    
    button.onclick = () => {
      alert(state.onClickMessage || 'Button clicked!');
    };

    wrapper.appendChild(button);
  };

  // Interactive Car Component
  const createInteractiveCar = (wrapper, state, setState) => {
    const car = document.createElement('div');
    car.className = 'car';
    
    car.innerHTML = `
      <div class="car-body">
        <div class="car-top"></div>
        <div class="car-bottom">
          <div class="car-wheel car-wheel-front"></div>
          <div class="car-wheel car-wheel-back"></div>
        </div>
      </div>
      <div class="car-details">
        <h3 class="car-model">${state.model || 'Sports Car'}</h3>
        <p class="car-specs">Color: ${state.color || 'red'} | Speed: ${state.speed || 'fast'}</p>
      </div>
    `;
    
    wrapper.appendChild(car);
  };

  // Interactive Card Component
  const createInteractiveCard = (wrapper, state, setState) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.maxWidth = state.maxWidth || '300px';
    
    card.innerHTML = `
      ${state.showImage ? `<div class="card-image">
        <img src="${state.imageUrl || 'https://via.placeholder.com/300x200'}" alt="Card image" />
      </div>` : ''}
      <div class="card-content">
        <h3 class="card-title">${state.title || 'Sample Card'}</h3>
        <p class="card-text">${state.content || 'This is a sample card component with the generated styling.'}</p>
      </div>
    `;
    
    wrapper.appendChild(card);
  };

  // Interactive Navbar Component
  const createInteractiveNavbar = (wrapper, state, setState) => {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    
    navbar.innerHTML = `
      <div class="navbar-brand">
        <span class="navbar-logo">${state.brand || 'Brand'}</span>
      </div>
      <div class="navbar-menu">
        ${(state.links || ['Home', 'About', 'Contact']).map(link => 
          `<a href="#" class="navbar-link">${link}</a>`
        ).join('')}
      </div>
    `;
    
    wrapper.appendChild(navbar);
  };

  // Generic Component
  const createGenericComponent = (wrapper, componentName) => {
    const genericComponent = document.createElement('div');
    genericComponent.className = 'generated-component';
    genericComponent.innerHTML = `
      <div style="padding: 20px; border: 2px dashed #ccc; border-radius: 8px; text-align: center;">
        <h3 style="margin: 0 0 10px 0; color: #666;">${componentName} Component</h3>
        <p style="margin: 0; color: #999;">Component preview with generated CSS styling</p>
      </div>
    `;
    wrapper.appendChild(genericComponent);
  };

  // Component Controls
  const createComponentControls = (container, state, setState) => {
    const controls = document.createElement('div');
    controls.className = 'component-controls';
    
    const componentName = jsx.match(/const\s+(\w+)\s*=/)?.[1] || 'Component';
    
    // Use the same improved component detection logic
    const isNavbar = jsx.includes('Navbar') || (jsx.includes('nav') && jsx.includes('navbar'));
    const isCar = jsx.includes('Car') || (jsx.includes('car') && !jsx.includes('navbar'));
    const isCard = jsx.includes('Card') || (jsx.includes('card') && !jsx.includes('navbar'));
    const isButton = jsx.includes('Button') || (jsx.includes('button') && !jsx.includes('navbar') && !jsx.includes('nav'));

    controls.innerHTML = `
      <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
        <strong>${componentName} Controls</strong> - Modify component properties
      </div>
    `;

    if (isNavbar) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Brand:</label>
          <input type="text" value="${state.brand || 'Brand'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {brand: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Links:</label>
          <input type="text" value="${(state.links || ['Home', 'About', 'Contact']).join(', ')}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {links: this.value.split(',').map(l => l.trim())}}))" />
        </div>
      `;
    } else if (isCar) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Model:</label>
          <input type="text" value="${state.model || 'Sports Car'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {model: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Color:</label>
          <select onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {color: this.value}}))">
            <option value="red" ${(state.color || 'red') === 'red' ? 'selected' : ''}>Red</option>
            <option value="blue" ${(state.color || 'red') === 'blue' ? 'selected' : ''}>Blue</option>
            <option value="green" ${(state.color || 'red') === 'green' ? 'selected' : ''}>Green</option>
            <option value="yellow" ${(state.color || 'red') === 'yellow' ? 'selected' : ''}>Yellow</option>
          </select>
        </div>
        <div class="control-group">
          <label>Speed:</label>
          <select onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {speed: this.value}}))">
            <option value="fast" ${(state.speed || 'fast') === 'fast' ? 'selected' : ''}>Fast</option>
            <option value="medium" ${(state.speed || 'fast') === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="slow" ${(state.speed || 'fast') === 'slow' ? 'selected' : ''}>Slow</option>
          </select>
        </div>
      `;
    } else if (isCard) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Title:</label>
          <input type="text" value="${state.title || 'Sample Card'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {title: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Content:</label>
          <input type="text" value="${state.content || 'This is a sample card component with the generated styling.'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {content: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Show Image:</label>
          <input type="checkbox" ${state.showImage ? 'checked' : ''} 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {showImage: this.checked}}))" />
        </div>
      `;
    } else if (isButton) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Text:</label>
          <input type="text" value="${state.text || 'Click me!'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {text: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Variant:</label>
          <select onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {variant: this.value}}))">
            <option value="primary" ${(state.variant || 'primary') === 'primary' ? 'selected' : ''}>Primary</option>
            <option value="secondary" ${(state.variant || 'primary') === 'secondary' ? 'selected' : ''}>Secondary</option>
            <option value="success" ${(state.variant || 'primary') === 'success' ? 'selected' : ''}>Success</option>
          </select>
        </div>
        <div class="control-group">
          <label>Size:</label>
          <input type="text" value="${state.fontSize || '16px'}" placeholder="16px"
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {fontSize: this.value}}))" />
        </div>
      `;
    }

    // Add event listener for state updates with error handling
    controls.addEventListener('updateState', (e) => {
      try {
        setState(prev => ({ ...prev, ...e.detail }));
      } catch (error) {
        console.error('State update error:', error);
      }
    });

    container.appendChild(controls);
  };

  if (!jsx && !css) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">🎨</div>
          <p className="text-lg mb-2">Component Preview</p>
          <p className="text-sm">Generated components will appear here</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg mb-2">Preview Error</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Live Component Preview</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>
      
      <div className="flex-1 relative bg-white overflow-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="flex items-center space-x-2">
              <div className="loading-spinner"></div>
              <span className="text-sm text-gray-600">Loading preview...</span>
            </div>
          </div>
        )}
        
        <div
          ref={previewRef}
          className="w-full h-full p-4"
        />
      </div>
    </div>
  );
}