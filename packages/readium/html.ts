export const readiumHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Readium Reader</title>
    <script src="https://unpkg.com/@readium/desktop@latest/dist/main.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            background: white;
        }
        #reader {
            width: 100vw;
            height: 100vh;
        }
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div id="reader">
        <div class="loading">Loading reader...</div>
    </div>
    
    <script>
        let reader = null;
        
        // Initialize Readium when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Initialize Readium reader
                reader = new window.Readium.Reader({
                    el: document.getElementById('reader'),
                    // Configure reader options
                    settings: {
                        enableSearch: true,
                        enableTTS: false,
                        fontSize: 16
                    }
                });
                
                // Send ready message to React Native
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'READER_READY'
                }));
                
            } catch (error) {
                console.error('Failed to initialize Readium:', error);
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'ERROR',
                    message: error.message
                }));
            }
        });
        
        // Listen for messages from React Native
        window.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);
            
            switch(data.type) {
                case 'LOAD_EPUB':
                    loadEpub(data.url);
                    break;
                case 'NEXT_PAGE':
                    reader?.next();
                    break;
                case 'PREV_PAGE':
                    reader?.prev();
                    break;
                case 'GO_TO_CHAPTER':
                    reader?.goTo(data.href);
                    break;
            }
        });
        
        async function loadEpub(epubUrl) {
            if (!reader) {
                console.error('Reader not initialized');
                return;
            }
            
            try {
                // Load the EPUB
                await reader.openPublication(epubUrl);
                
                // Send success message
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'EPUB_LOADED'
                }));
                
            } catch (error) {
                console.error('Failed to load EPUB:', error);
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'ERROR',
                    message: 'Failed to load EPUB: ' + error.message
                }));
            }
        }
        
        // Handle reader events
        function setupReaderEvents() {
            if (reader) {
                reader.on('relocated', function(location) {
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'LOCATION_CHANGED',
                        location: location
                    }));
                });
                
                reader.on('selected', function(selection) {
                    window.ReactNativeWebView?.postMessage(JSON.stringify({
                        type: 'TEXT_SELECTED',
                        text: selection.text
                    }));
                });
            }
        }
    </script>
</body>
</html>
`;
