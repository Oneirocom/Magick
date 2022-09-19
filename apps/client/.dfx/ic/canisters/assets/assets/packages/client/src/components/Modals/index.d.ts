import InfoModal from './InfoModal';
export declare const getModals: () => {
    example: ({ content }: {
        content: any;
    }) => JSX.Element;
    infoModal: ({ title, content, checkbox }: InfoModal) => JSX.Element;
    deployModal: ({ content, onClose, options: _options }: {
        content: any;
        onClose: any;
        options: any;
    }) => JSX.Element;
    editSpellModal: ({ closeModal, spellId, name, tab }: {
        closeModal: any;
        spellId: any;
        name: any;
        tab: any;
    }) => JSX.Element;
    saveAsModal: ({ tab, closeModal }: {
        tab: any;
        closeModal: any;
    }) => JSX.Element;
    config: ({ closeModal, name, id, modal }: {
        closeModal: any;
        name: any;
        id: any;
        modal: any;
    }) => JSX.Element;
    clientSettings: ({ closeModal, name, id }: {
        closeModal: any;
        name: any;
        id: any;
    }) => JSX.Element;
    scope: ({ closeModal, name, id }: {
        closeModal: any;
        name: any;
        id: any;
    }) => JSX.Element;
    deleteModal: ({ closeModal, handledelete, id }: {
        closeModal: any;
        handledelete: any;
        id: any;
    }) => JSX.Element;
    documentStoreAddEditModal: ({ closeModal, store, getDocumentsStores, opType }: {
        closeModal: any;
        store: any;
        getDocumentsStores: any;
        opType: any;
    }) => JSX.Element;
    documentStoreDeleteModal: ({ closeModal, store, getDocumentsStores }: {
        closeModal: any;
        store: any;
        getDocumentsStores: any;
    }) => JSX.Element;
    documentAddModal: ({ closeModal, storeId, documentId, isContentObject, getDocuments, getContentObjects, }: {
        closeModal: any;
        storeId: any;
        documentId: any;
        isContentObject: any;
        getDocuments: any;
        getContentObjects: any;
    }) => JSX.Element;
    documentEditModal: ({ closeModal, field, document, getDocuments }: {
        closeModal: any;
        field: any;
        document: any;
        getDocuments: any;
    }) => JSX.Element;
    documentDeleteModal: ({ closeModal, documentId, objId, isContentObj, getDocuments, getContentObjects, }: {
        closeModal: any;
        documentId: any;
        objId: any;
        isContentObj: any;
        getDocuments: any;
        getContentObjects: any;
    }) => JSX.Element;
    contentObjEditModal: ({ contents, getContentObjects }: {
        contents: any;
        getContentObjects: any;
    }) => JSX.Element;
};
