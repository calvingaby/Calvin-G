
import React from 'react';

interface PreviewPanelProps {
  htmlContent: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ htmlContent }) => {
  return (
    <div className="w-2/3 flex flex-col bg-gray-900 h-full">
      <div className="bg-gray-800 p-3 flex items-center border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm text-gray-400">Preview</div>
      </div>
      <div className="flex-1 bg-white">
        {htmlContent ? (
          <iframe
            srcDoc={htmlContent}
            title="Website Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold">Website Preview</h2>
              <p>Your generated website will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
