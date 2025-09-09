// ./src/api/media/controllers/media.js
const { factories } = require('@strapi/strapi');

module.exports = factories.createCoreController('plugin::upload.file', ({ strapi }) => ({
    /**
     * GET /media/folders?parentId=<documentId>&start=0&limit=24
     */
    async listFolders(ctx) {
        const { parentId, pagination: { page = 0, pageSize = 50 } } = ctx.request.query;
        const start = 1 * page * pageSize;
        const limit = pageSize;
        const filters = parentId == false ? { parent: { $null: true } } : parentId ? { parent: { documentId: parentId } } : {};

        strapi.log.info('listFolders filters:' + limit + ',' + start+',' + page + ',' + pageSize);

        const folders = await strapi.documents('plugin::upload.folder').findMany({
            filters,
            sort: [{ name: 'asc' }],
            start: Number(start),
            limit: Number(limit),
            // fields: ['name', 'pathId'], // optionally restrict fields
        });

        ctx.body = folders;
    },

    /**
     * GET /media/files?folderId=<documentId>&start=0&limit=24
     */
    async listFiles(ctx) {
        const { folderId, pagination: { page = 0, pageSize = 50 } } = ctx.request.query;
        const start = page * pageSize;
        const limit = pageSize;

        const filters = folderId == false ? { folder: { $null: true } } : folderId ? { folder: { documentId: folderId } } : {};

        const files = await strapi.documents('plugin::upload.file').findMany({
            filters,
            sort: [{ createdAt: 'desc' }],
            start: Number(start),
            limit: Number(limit),
            populate: { folder: true },
        });

        ctx.body = files;
    },

    /**
     * POST /media/folders
     * Body (JSON):
     * { "name": "My Folder", "parentId": "<optional parent documentId>" }
     * — or —
     * { "data": { "name": "My Folder", "parentId": "<id>" } }  // both shapes supported
     */
    async createFolder(ctx) {
        // Accept raw {name, parentId} or Strapi-style { data: { ... } }
        const body = ctx.request.body?.data || ctx.request.body || {};
        const { name, parentId } = body;
        console.log('createFolder body:', body);
        strapi.log.info('createFolder body:', body);

        if (!name) ctx.throw(400, 'Missing "name"');
        try {

            const folderService = strapi.plugin('upload').service('folder');

            const folder = await folderService.create({
                name,
                parent: parentId || null, // parentId must be a numeric DB id, not documentId
            });

            ctx.status = 201;
            ctx.body = folder;
        } catch (err) {
            strapi.log.error('Error creating folder:', err);
            ctx.throw(500, 'Error creating folder');
        }
    },
}));
