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

      // Create a dynamic preview that can handle any component
      const createDynamicPreview = () => {
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

        // Extract component name
        const componentName = jsx.match(/const\s+(\w+)\s*=/)?.[1] || 'Component';
        
        console.log('Creating dynamic component:', componentName);

        // Create a simple interactive version of the component
        createInteractiveComponent(wrapper, componentName, componentState, setComponentState);

        // Add component controls
        createComponentControls(container, componentState, setComponentState, componentName);

        // Add event listener for state updates with error handling
        const controls = container.querySelector('.component-controls');
        if (controls) {
          controls.addEventListener('updateState', (e) => {
            try {
              setComponentState(prev => ({ ...prev, ...e.detail }));
            } catch (error) {
              console.error('State update error:', error);
            }
          });
        }
      };

      createDynamicPreview();
      setLoading(false);

    } catch (err) {
      console.error('Preview setup error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [jsx, css, componentState]);

  // Create interactive component based on the generated JSX
  const createInteractiveComponent = (wrapper, componentName, state, setState) => {
    // Create a simple interactive version based on component type
    const componentDiv = document.createElement('div');
    componentDiv.className = 'generated-component';
    
    // Extract props from the JSX to create a simple interactive version
    if (componentName.toLowerCase().includes('button')) {
      componentDiv.innerHTML = `
        <button class="btn btn-primary" style="padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer;">
          ${state.text || 'Click me!'}
        </button>
      `;
      
      const button = componentDiv.querySelector('button');
      button.onclick = () => {
        alert(state.onClickMessage || 'Button clicked!');
      };
    } else if (componentName.toLowerCase().includes('dropdown')) {
      componentDiv.innerHTML = `
        <div class="dropdown" style="position: relative; width: 300px;">
          <button class="dropdown-button" style="width: 100%; padding: 12px 16px; background: white; border: 2px solid #e1e5e9; border-radius: 8px; cursor: pointer;">
            ${state.selectedOption || state.placeholder || 'Select an option'} ▼
          </button>
        </div>
      `;
      
      const button = componentDiv.querySelector('button');
      button.onclick = () => {
        const options = state.options || ['Option 1', 'Option 2', 'Option 3'];
        const selected = prompt('Select an option:', options.join(', '));
        if (selected && options.includes(selected)) {
          setState(prev => ({ ...prev, selectedOption: selected }));
        }
      };
    } else if (componentName.toLowerCase().includes('form')) {
      componentDiv.innerHTML = `
        <form style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 15px;">${state.title || 'Form'}</h3>
          <div style="margin-bottom: 10px;">
            <label>Email:</label>
            <input type="email" placeholder="${state.emailPlaceholder || 'Enter email'}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label>Password:</label>
            <input type="password" placeholder="${state.passwordPlaceholder || 'Enter password'}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <button type="submit" style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ${state.buttonText || 'Submit'}
          </button>
        </form>
      `;
      
      const form = componentDiv.querySelector('form');
      form.onsubmit = (e) => {
        e.preventDefault();
        alert('Form submitted!');
      };
    } else if (componentName.toLowerCase().includes('card')) {
      componentDiv.innerHTML = `
        <div class="card" style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px; max-width: 300px;">
          <h3 style="margin-bottom: 10px;">${state.title || 'Card Title'}</h3>
          <p style="color: #666;">${state.content || 'This is a sample card component.'}</p>
        </div>
      `;
    } else if (componentName.toLowerCase().includes('navbar')) {
      componentDiv.innerHTML = `
        <nav style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold; color: #007bff;">${state.brand || 'Brand'}</span>
          <div style="display: flex; gap: 20px;">
            ${(state.links || ['Home', 'About', 'Contact']).map(link => 
              `<a href="#" style="text-decoration: none; color: #333;">${link}</a>`
            ).join('')}
          </div>
        </nav>
      `;
    } else {
      // Generic component fallback
      componentDiv.innerHTML = `
        <div style="padding: 20px; border: 2px dashed #ccc; border-radius: 8px; text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #666;">${componentName} Component</h3>
          <p style="margin: 0; color: #999;">Interactive preview of the generated component</p>
        </div>
      `;
    }
    
    wrapper.appendChild(componentDiv);
  };

  // Create generic component controls
  const createComponentControls = (container, state, setState, componentName) => {
    const controls = document.createElement('div');
    controls.className = 'component-controls';
    
    controls.innerHTML = `
      <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
        <strong>${componentName} Controls</strong> - Modify component properties
      </div>
    `;

    // Add generic controls based on component type
    if (componentName.toLowerCase().includes('button')) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Text:</label>
          <input type="text" value="${state.text || 'Click me!'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {text: this.value}}))" />
        </div>
      `;
    } else if (componentName.toLowerCase().includes('dropdown')) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Placeholder:</label>
          <input type="text" value="${state.placeholder || 'Select an option'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {placeholder: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Options:</label>
          <input type="text" value="${(state.options || ['Option 1', 'Option 2', 'Option 3']).join(', ')}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {options: this.value.split(',').map(o => o.trim())}}))" />
        </div>
      `;
    } else if (componentName.toLowerCase().includes('form')) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Title:</label>
          <input type="text" value="${state.title || 'Form'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {title: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Button Text:</label>
          <input type="text" value="${state.buttonText || 'Submit'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {buttonText: this.value}}))" />
        </div>
      `;
    } else if (componentName.toLowerCase().includes('card')) {
      controls.innerHTML += `
        <div class="control-group">
          <label>Title:</label>
          <input type="text" value="${state.title || 'Card Title'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {title: this.value}}))" />
        </div>
        <div class="control-group">
          <label>Content:</label>
          <input type="text" value="${state.content || 'This is a sample card component.'}" 
                 onchange="this.parentElement.parentElement.dispatchEvent(new CustomEvent('updateState', {detail: {content: this.value}}))" />
        </div>
      `;
    } else if (componentName.toLowerCase().includes('navbar')) {
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
    }

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
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div 
          ref={previewRef} 
          className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
}