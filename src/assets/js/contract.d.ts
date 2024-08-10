// assets/js/contract.d.ts

interface TRD_CONTRACT {
     EVENT: {
          SHOW_FORM_INPUT: string;
          HIDE_FORM_INPUT: string;
          LOCAL_STORAGE_CHANGE: string;
     };
     LOCAL_STORAGE_KEY: {
          GITHUB_DATA_TREE: string;
     };
     sendMessageToParent(event: string, data: object): void;
     clearLocalStorage(): void;
}

declare global {
     interface Window {
          TRD_CONTRACT: TRD_CONTRACT;
          loadFormToIFrame(url: string, container: HTMLIFrameElement): void;
     }
}

export { };
