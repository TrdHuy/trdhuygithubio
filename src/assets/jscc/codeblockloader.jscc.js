const codeb_tab = document.querySelectorAll("[codeb-tab-lang]");
const codeb_copy_btn = document.querySelectorAll("[codeb-copy-btn]");

codeb_tab.forEach(function (tab) {
    tab.addEventListener('click', function () {
        var selectedLang = tab.getAttribute('codeb-tab-lang');
        showCode(selectedLang, tab);
    });
});

codeb_copy_btn.forEach(function (btn) {
    btn.addEventListener('click', function () {
        copyCode(btn);
    });
});
// Function to show the selected language code block within a specific container
function showCode(language, tabElement) {
    var container = tabElement.closest('[codeb-container]');  // Get the closest code container

    // Remove active class from all tabs within the container
    var tabs = container.querySelectorAll('[codeb-tab-lang]');
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });

    // Add active class to the clicked tab
    tabElement.classList.add('active');

    // Hide all code blocks within the container
    var codeBlocks = container.querySelectorAll('pre');
    codeBlocks.forEach(function (code) {
        code.classList.remove('active');
    });

    // Show the selected code block
    var selectedCodeBlock = container.querySelector('#' + language);
    selectedCodeBlock.classList.add('active');
}

// Function to copy the code from the currently active block
function copyCode(button) {
    var container = button.closest('[codeb-container]');  // Get the closest code container

    // Find the active <code> element inside the container
    var activeCodeBlock = container.querySelector('pre.active code');
    var textToCopy = activeCodeBlock.innerText;

    // Create a temporary textarea element to copy the text
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);

    // Select the text and copy it
    tempTextArea.select();
    document.execCommand("copy");

    // Remove the temporary textarea
    document.body.removeChild(tempTextArea);

    // Temporarily change the icon to checkmark after copy
    var originalIcon = button.innerHTML;
    button.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';

    // Reset the icon back to the copy icon after 2 seconds
    setTimeout(function () {
        button.innerHTML = originalIcon;
    }, 2000);
}

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var script = document.createElement('script');
            script.src = src;

            script.onload = function () {
                console.log(src + " loaded successfully");
                resolve();
            };

            script.onerror = function () {
                console.error("Error loading script: " + src);
                reject(new Error("Error loading script: " + src));
            };

            document.head.appendChild(script);
        }, 100);
    });
}
function loadCSS(href, callback) {
    setTimeout(function () {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;

        // Gọi callback khi CSS đã load xong
        link.onload = function () {
            console.log(href + " loaded successfully");
            if (callback) callback();
        };

        link.onerror = function () {
            console.error("Error loading CSS: " + href);
        };

        document.head.appendChild(link);
    }, 100); // Trì hoãn 2 giây trước khi thực hiện việc tải CSS
}
document.addEventListener("DOMContentLoaded", async function () {
    await loadScript("//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/highlight.min.js")
    await loadCSS("//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.0/styles/dark.min.css")

    // Find all code elements with src attribute
    var codeElements = document.querySelectorAll('code[src]');

    codeElements.forEach(function (codeElement) {
        var filePath = codeElement.getAttribute('src');
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("File not found: " + filePath);
                }
                return response.text();
            })
            .then(data => {
                codeElement.textContent = data;
                hljs.highlightElement(codeElement);
            })
            .catch(error => {
                codeElement.textContent = "Error: " + error.message; // Display error if file not found
            });
    });

    var codeElementsWithoutSrc = document.querySelectorAll('code:not([src])');
    codeElementsWithoutSrc.forEach(function(element) {
        hljs.highlightElement(element);
    });
});

