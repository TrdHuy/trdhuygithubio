var btn = document.getElementById("submitToken");
btn.onclick = async function () {
     if (window.frameElement && window.frameElement.submitCallback) {
          const token = document.getElementById('inputToken').value;
          window.frameElement.submitCallback(token, window.frameElement)
     }
}


