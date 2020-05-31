const path = require('path');
const fs = require('fs').promises;

require('dotenv').config();
const fastify = require('fastify')();

const root = path.join(__dirname, '../src');

fastify.register(require('fastify-static'), {root});

replaceBase('/atlassian-connect.json', 'application/json');
replaceBase('/gadget/main.html', 'text/html');

fastify.listen(8000, function(err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
});

function replaceBase(filename, contentType) {
    fastify.get(filename, async (req, reply) => {
        const content = await fs.readFile(path.join(root, filename),
            'utf-8');
        const result = content
        .replace(/\${host}/g, process.env.HOST)
        .replace(/\${baseUrl}/g, process.env.BASE_URL);
        reply.code(200).type(contentType).send(result);
    });
}
