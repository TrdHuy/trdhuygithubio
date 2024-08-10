window.TRD_CONTRACT = {

     EVENT: {
          IFRAME_CONTENT_SIZE_CHANGED: 'iframe_content_size_changed',
          SHOW_FORM_INPUT: 'func_show_from_input',
          HIDE_FORM_INPUT: 'func_hide_from_input',
          LOCAL_STORAGE_CHANGE: 'localStorageChange',
     },
     LOCAL_STORAGE_KEY: {
          GITHUB_DATA_TREE: 'TrdHuy.github.io_Developer_githubDataTrees',
     },
     sendMessageToParent(event, data) {
          window.parent.postMessage({ event: event, ...data }, '*');
     },
     clearLocalStorage() {
          Object.values(this.LOCAL_STORAGE_KEY).forEach(key => {
               localStorage.removeItem(key);
          });
     },
};