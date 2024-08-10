window.addEventListener('localStorageChange', function (event) {
     console.log('localStorage changed:', event.detail);
     // Thực hiện các hành động cần thiết khi localStorage thay đổi
});
const TRD_CONTRACT = window.TRD_CONTRACT
var btn = document.getElementById("submitToken");

btn.onclick = async function () {
     const cachedFiles = localStorage.getItem(TRD_CONTRACT.LOCAL_STORAGE_KEY.GITHUB_DATA_TREE);
     // showLoading();

     if (cachedFiles) {
          const files = JSON.parse(cachedFiles);
          const filteredFiles = files.filter(item => item.path.startsWith(folderPath) && item.type === 'blob' && item.path.endsWith('index.html'));
          displayFiles(filteredFiles, files);

     } else {
          const token = document.getElementById('inputToken').value;
          await loadFiles(token);
          TRD_CONTRACT.sendMessageToParent(TRD_CONTRACT.EVENT.HIDE_FORM_INPUT, { frameId: window.frameId });
          // modal.style.display = "block";
          // hideLoading();
     }
}

// function showLoading() {
//      document.getElementById('loadingModal').style.display = 'block';
// }

// function hideLoading() {
//      document.getElementById('loadingModal').style.display = 'none';
// }

async function loadFiles(token) {
     const user = 'TrdHuy';
     const repo = 'TrdHuy.github.io';
     const branch = 'master';
     const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;

     try {
          // showLoading();
          const response = await fetch(url, {
               headers: {
                    'Authorization': `token ${token}`
               }
          });

          if (response.ok) {
               const data = await response.json();
               localStorage.setItem(TRD_CONTRACT.LOCAL_STORAGE_KEY.GITHUB_DATA_TREE,
                    JSON.stringify(data.tree));
          } else {
               alert('Failed to fetch files. Please check your token and repo path.');
          }
     } catch (error) {
          console.error('Error fetching files:', error);
          alert('An error occurred. Please try again.');
     } finally {
          // hideLoading();
     }
}
