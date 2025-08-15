const meRoute = require('./routes/me');
const meController = require('./controllers/me');
const userSchema = require('./content-types/user/schema');
const meSchema = require('./content-types/me/schema');

//const providers = require('./services/providers')
//const email = require('./services/email')
//const payment = require('./services/payment')


module.exports = (plugin) => {

    
    const capi = plugin.routes['content-api'];

    plugin.routes['content-api'] = (...args) => {

        const resp = typeof capi === 'function' ? capi(...args) : capi;
        resp.routes.push(...meRoute);
        return resp;

    }

    console.log('Adding custom user permissions routes');
    //meRoute.forEach(route => capi.routes.push(route));
    Object.assign(plugin.contentTypes.user.schema, userSchema);
    plugin.contentTypes.me = { schema: meSchema }
    // Object.assign(plugin.controllers.user, meController);
    plugin.controllers.me = meController

    console.log(plugin)
    return plugin;
};
