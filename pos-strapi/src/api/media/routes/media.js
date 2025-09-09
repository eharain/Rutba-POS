module.exports = {
    routes: [
        {
            method: 'GET', path: '/media/folders',
            handler: 'media.listFolders',
            config: { auth: false }
        },
        {
            method: 'GET', path: '/media/files',
            handler: 'media.listFiles',
            config: { auth: false }
        },
        {
            method: 'POST', path: '/media/folders',
            handler: 'media.createFolder',
            config: { auth: false }
        },
    ],
};