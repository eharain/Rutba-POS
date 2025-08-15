'use strict';
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('plugin::users-permissions.me', ({ strapi }) => ({
    mePermissions: async (ctx) => {
        try {

            const user = ctx.state.user;
            if (!user) {
                return ctx.unauthorized("You must be logged in");
            }

            const permissions = await strapi.query("plugin::users-permissions.permission").findMany({
                where: { role: { id: user.role.id } },
                populate: false,
                select: ['action'],
            });

            const data = {
                role: user.role.name,
                permissions: permissions.map(p => p.action)
            }
            ctx.send(data);
        } catch (err) {
            ctx.internalServerError("Error fetching permissions");
            console.error("Error Fetching user permissions...", err);
        }
    }
})); 