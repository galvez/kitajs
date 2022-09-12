import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';
import '@fastify/swagger';
import AuthParam from './helpers/auth-param';
import '@fastify/cookie';
import * as ResponseTypesController from './routes/response-types';
import * as WsController from './routes/ws';
import * as $name$Controller from './routes/[name]';

/** The resultant config read from your kita config file. */
export const KitaConfig = {
  params: { AuthParam: './src/helpers/auth-param' },
  tsconfig: './tsconfig.json',
  templates: '@kitajs/generator/templates',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  routes: { output: './src/routes.ts' }
};

/** The fastify plugin to be registered. */
export const Kita = fp<{ context: ProvidedRouteContext }>((fastify, options) => {
  const context: RouteContext = { config: KitaConfig, fastify, ...options.context };

  fastify.addSchema({
    $id: 'HelloWorldQuery',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      age: {
        type: 'number'
      }
    },
    required: ['name', 'age'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'def-number',
    type: 'number'
  });

  fastify.addSchema({
    $id: 'NameQuery',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    },
    required: ['name'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'withTypedPromiseResponseResponse',
    type: 'object',
    properties: {
      a: {
        type: 'string'
      }
    },
    required: ['a'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'withInferredResponseResponse',
    type: 'object',
    properties: {
      b: {
        type: 'string'
      }
    },
    required: ['b'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'PR',
    type: 'object',
    properties: {
      c: {
        type: 'string'
      }
    },
    required: ['c'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'DR',
    type: 'object',
    properties: {
      d: {
        type: 'string'
      }
    },
    required: ['d'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'fullExampleExclusiveQueryResponse',
    type: 'number'
  });

  fastify.addSchema({
    $id: 'fullExampleUsingBodyResponse',
    type: 'number'
  });

  fastify.route({
    method: 'PUT',
    url: '/:name',
    schema: {
      operationId: 'fullExampleUsingBody',
      params: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
        additionalProperties: false
      },
      body: {
        type: 'object',
        properties: { path: { $ref: 'def-number' }, bodyProp: { $ref: 'def-number' } },
        required: ['path', 'bodyProp'],
        additionalProperties: false
      },
      querystring: {
        type: 'object',
        properties: {
          paramQuery: { type: 'string' },
          typedQuery: { type: 'boolean' },
          namedQuery: { type: 'string' },
          typedAndNamedQuery: { type: 'boolean' }
        },
        required: ['paramQuery', 'typedQuery', 'namedQuery', 'typedAndNamedQuery'],
        additionalProperties: false
      },
      response: { default: { $ref: 'fullExampleUsingBodyResponse' } },
      description: 'route description 1',
      security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
      tags: ['test tag 1'],
      summary: 'route summary 1'
    },
    handler: async (request, reply) => {
      const authJwt = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return;
      }
      const authBasic = await AuthParam.call(context, request, reply, ['basic']);

      if (reply.sent) {
        return;
      }

      const data = await $name$Controller.put.apply(context, [
        (request.params as { ['name']: Parameters<typeof $name$Controller.put>[0] })[
          'name'
        ],
        request.cookies?.cookie,
        (request.body as { ['path']: Parameters<typeof $name$Controller.put>[2] }).path,
        (request.body as { ['bodyProp']: Parameters<typeof $name$Controller.put>[3] })
          .bodyProp,
        (request.query as { ['paramQuery']: string })['paramQuery'],
        (request.query as { ['typedQuery']: boolean })['typedQuery'],
        (request.query as { ['namedQuery']: string })['namedQuery'],
        (request.query as { ['typedAndNamedQuery']: boolean })['typedAndNamedQuery'],
        request,
        reply,
        authJwt,
        authBasic
      ]);

      if (reply.sent) {
        //@ts-ignore - When $name$Controller.put() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'POST',
    url: '/:name',
    schema: {
      operationId: 'fullExampleExclusiveQuery',
      params: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
        additionalProperties: false
      },
      body: { $ref: 'NameQuery' },
      querystring: { $ref: 'NameQuery' },
      response: { default: { $ref: 'fullExampleExclusiveQueryResponse' } },
      description: 'route description 2',
      security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
      tags: ['test tag 2'],
      summary: 'route summary 2'
    },
    handler: async (request, reply) => {
      const authJwt = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return;
      }
      const authBasic = await AuthParam.call(context, request, reply, ['basic']);

      if (reply.sent) {
        return;
      }

      const data = await $name$Controller.post.apply(context, [
        (request.params as { ['name']: Parameters<typeof $name$Controller.post>[0] })[
          'name'
        ],
        request.cookies?.cookie,
        request.body as Parameters<typeof $name$Controller.post>[2],
        request.query as Parameters<typeof $name$Controller.post>[3],
        request,
        reply,
        authJwt,
        authBasic
      ]);

      if (reply.sent) {
        //@ts-ignore - When $name$Controller.post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '/response-types',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } },
      tags: ['Response Test']
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Get() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'POST',
    url: '/response-types',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } },
      tags: ['Response Test']
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesController.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '/response-types',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } },
      tags: ['Response Test']
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Put() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'DELETE',
    url: '/response-types',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } },
      tags: ['Response Test']
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.get(
    '/ws',
    {
      schema: { hide: true, operationId: 'name' },
      websocket: true
    },
    async (connection, request) => {
      return WsController.ws.apply(context, [
        connection as Parameters<typeof WsController.ws>[0],
        connection.socket,
        request as Parameters<typeof WsController.ws>[2]
      ]);
    }
  );

  // Ensure this function remains a "async" function
  return Promise.resolve();
});

/** Internal helpers to this template */
export const Helpers = {
  replyAlreadySent(data: any) {
    const error = new Error('Reply already sent, but controller returned data');

    //@ts-expect-error - include data in error to help debugging
    error.data = data;

    return error;
  },

  workerCode(controller: string, method: string, importPath: string) {
    return `
const ${controller} = require('./${importPath}');
const { parentPort, workerData } = require('node:worker_threads');

(async () => {
  try {
    const result = await ${controller}.${method}.apply(workerData.context, workerData.params);
    parentPort.postMessage(result);
  } catch(err) {
    parentPort.emit('messageerror', err);
  }
})();
`.trim();
  }
};

import { Worker ,} from 'node:worker_threads';

new Promise((resolve, reject) => {
  const worker = new Worker(Helpers.workerCode('$name$', 'post', '$name$.controller'), {
    eval: true,
    workerData: {
      context: {},
      params: []
    }
  });

  worker.on('message', resolve);
  worker.on('error', reject);
});

/** Handlebars data for hydration, just for debugging purposes. */
export const HBS_CONF = {
  config: {
    params: { AuthParam: './src/helpers/auth-param' },
    tsconfig: './tsconfig.json',
    templates: '@kitajs/generator/templates',
    controllers: {
      glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
      prefix: '(?:.*src)?/?(?:routes/?)'
    },
    routes: { output: './src/routes.ts' }
  },
  routes: [
    {
      templatePath: 'routes/rest.hbs',
      controllerName: '$name$Controller',
      url: '/:name',
      controllerPath: 'src/routes/[name].ts:25:21',
      controllerMethod: 'put',
      parameters: [
        {
          value:
            "(request.params as { ['name']: Parameters<typeof $name$Controller.put>[0] })['name']"
        },
        { value: 'request.cookies?.cookie' },
        {
          value:
            "(request.body as { ['path']: Parameters<typeof $name$Controller.put>[2] }).path"
        },
        {
          value:
            "(request.body as { ['bodyProp']: Parameters<typeof $name$Controller.put>[3] }).bodyProp"
        },
        { value: "(request.query as { ['paramQuery']: string })['paramQuery']" },
        { value: "(request.query as { ['typedQuery']: boolean })['typedQuery']" },
        { value: "(request.query as { ['namedQuery']: string })['namedQuery']" },
        {
          value:
            "(request.query as { ['typedAndNamedQuery']: boolean })['typedAndNamedQuery']"
        },
        { value: 'request' },
        { value: 'reply' },
        {
          value: 'authJwt',
          helper:
            "const authJwt = await AuthParam.call(context, request, reply, ['jwt']);"
        },
        {
          value: 'authBasic',
          helper:
            "const authBasic = await AuthParam.call(context, request, reply, ['basic']);"
        }
      ],
      schema: {
        operationId: 'fullExampleUsingBody',
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
          additionalProperties: false
        },
        body: {
          type: 'object',
          properties: { path: { $ref: 'def-number' }, bodyProp: { $ref: 'def-number' } },
          required: ['path', 'bodyProp'],
          additionalProperties: false
        },
        querystring: {
          type: 'object',
          properties: {
            paramQuery: { type: 'string' },
            typedQuery: { type: 'boolean' },
            namedQuery: { type: 'string' },
            typedAndNamedQuery: { type: 'boolean' }
          },
          required: ['paramQuery', 'typedQuery', 'namedQuery', 'typedAndNamedQuery'],
          additionalProperties: false
        },
        response: { default: { $ref: 'fullExampleUsingBodyResponse' } },
        description: 'route description 1',
        security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
        tags: ['test tag 1'],
        summary: 'route summary 1'
      },
      method: 'PUT',
      operationId: 'fullExampleUsingBody',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'/:name\',\n  schema: {"operationId":"fullExampleUsingBody","params":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false},"body":{"type":"object","properties":{"path":{"$ref":"def-number"},"bodyProp":{"$ref":"def-number"}},"required":["path","bodyProp"],"additionalProperties":false},"querystring":{"type":"object","properties":{"paramQuery":{"type":"string"},"typedQuery":{"type":"boolean"},"namedQuery":{"type":"string"},"typedAndNamedQuery":{"type":"boolean"}},"required":["paramQuery","typedQuery","namedQuery","typedAndNamedQuery"],"additionalProperties":false},"response":{"default":{"$ref":"fullExampleUsingBodyResponse"}},"description":"route description 1","security":[{"default":[]},{"admin":["read-user","write user","4","76"]}],"tags":["test tag 1"],"summary":"route summary 1"},\n  handler: async (request, reply) => {\n        const authJwt = await AuthParam.call(context, request, reply, [\'jwt\']);\n\n        if (reply.sent) {\n          return;\n        }\n        const authBasic = await AuthParam.call(context, request, reply, [\'basic\']);\n\n        if (reply.sent) {\n          return;\n        }\n\n    const data = await $name$Controller.put.apply(context, [(request.params as { [\'name\']: Parameters<typeof $name$Controller.put>[0] })[\'name\'],request.cookies?.cookie,(request.body as { [\'path\']: Parameters<typeof $name$Controller.put>[2] }).path,(request.body as { [\'bodyProp\']: Parameters<typeof $name$Controller.put>[3] }).bodyProp,(request.query as { [\'paramQuery\']: string })[\'paramQuery\'],(request.query as { [\'typedQuery\']: boolean })[\'typedQuery\'],(request.query as { [\'namedQuery\']: string })[\'namedQuery\'],(request.query as { [\'typedAndNamedQuery\']: boolean })[\'typedAndNamedQuery\'],request,reply,authJwt,authBasic]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When $name$Controller.put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: '$name$Controller',
      url: '/:name',
      controllerPath: 'src/routes/[name].ts:61:21',
      controllerMethod: 'post',
      parameters: [
        {
          value:
            "(request.params as { ['name']: Parameters<typeof $name$Controller.post>[0] })['name']"
        },
        { value: 'request.cookies?.cookie' },
        { value: 'request.body as Parameters<typeof $name$Controller.post>[2]' },
        { value: '(request.query as Parameters<typeof $name$Controller.post>[3])' },
        { value: 'request' },
        { value: 'reply' },
        {
          value: 'authJwt',
          helper:
            "const authJwt = await AuthParam.call(context, request, reply, ['jwt']);"
        },
        {
          value: 'authBasic',
          helper:
            "const authBasic = await AuthParam.call(context, request, reply, ['basic']);"
        }
      ],
      schema: {
        operationId: 'fullExampleExclusiveQuery',
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
          additionalProperties: false
        },
        body: { $ref: 'NameQuery' },
        querystring: { $ref: 'NameQuery' },
        response: { default: { $ref: 'fullExampleExclusiveQueryResponse' } },
        description: 'route description 2',
        security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
        tags: ['test tag 2'],
        summary: 'route summary 2'
      },
      method: 'POST',
      operationId: 'fullExampleExclusiveQuery',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'/:name\',\n  schema: {"operationId":"fullExampleExclusiveQuery","params":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false},"body":{"$ref":"NameQuery"},"querystring":{"$ref":"NameQuery"},"response":{"default":{"$ref":"fullExampleExclusiveQueryResponse"}},"description":"route description 2","security":[{"default":[]},{"admin":["read-user","write user","4","76"]}],"tags":["test tag 2"],"summary":"route summary 2"},\n  handler: async (request, reply) => {\n        const authJwt = await AuthParam.call(context, request, reply, [\'jwt\']);\n\n        if (reply.sent) {\n          return;\n        }\n        const authBasic = await AuthParam.call(context, request, reply, [\'basic\']);\n\n        if (reply.sent) {\n          return;\n        }\n\n    const data = await $name$Controller.post.apply(context, [(request.params as { [\'name\']: Parameters<typeof $name$Controller.post>[0] })[\'name\'],request.cookies?.cookie,request.body as Parameters<typeof $name$Controller.post>[2],(request.query as Parameters<typeof $name$Controller.post>[3]),request,reply,authJwt,authBasic]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When $name$Controller.post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:6:21',
      controllerMethod: 'Get',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Get>[0])' }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } },
        tags: ['Response Test']
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'/response-types\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}},"tags":["Response Test"]},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:16:21',
      controllerMethod: 'Post',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Post>[0])' }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } },
        tags: ['Response Test']
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesController.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'/response-types\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}},"tags":["Response Test"]},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesController.preHandler\n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:28:21',
      controllerMethod: 'Put',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Put>[0])' }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } },
        tags: ['Response Test']
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'/response-types\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}},"tags":["Response Test"]},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:40:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value: '(request.query as Parameters<typeof ResponseTypesController.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } },
        tags: ['Response Test']
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'/response-types\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}},"tags":["Response Test"]},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/websocket.hbs',
      controllerName: 'WsController',
      url: '/ws',
      controllerPath: 'src/routes/ws.ts:3:15',
      parameters: [
        { value: 'connection as Parameters<typeof WsController.ws>[0]' },
        { value: 'connection.socket' },
        { value: 'request as Parameters<typeof WsController.ws>[2]' }
      ],
      schema: { hide: true, operationId: 'name' },
      websocket: true,
      controllerMethod: 'ws',
      method: 'GET',
      operationId: 'name',
      template:
        'fastify.get(\n  \'/ws\',\n  {\n    schema: {"hide":true,"operationId":"name"},\n    websocket: true,\n    \n  },\n  async (connection, request) => {\n\n    return WsController.ws.apply(context, [connection as Parameters<typeof WsController.ws>[0],connection.socket,request as Parameters<typeof WsController.ws>[2]]);\n  }\n);'
    }
  ],
  schemas: [
    {
      $id: 'HelloWorldQuery',
      type: 'object',
      properties: { name: { type: 'string' }, age: { type: 'number' } },
      required: ['name', 'age'],
      additionalProperties: false
    },
    { $id: 'def-number', type: 'number' },
    {
      $id: 'NameQuery',
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
      additionalProperties: false
    },
    {
      $id: 'withTypedPromiseResponseResponse',
      type: 'object',
      properties: { a: { type: 'string' } },
      required: ['a'],
      additionalProperties: false
    },
    {
      $id: 'withInferredResponseResponse',
      type: 'object',
      properties: { b: { type: 'string' } },
      required: ['b'],
      additionalProperties: false
    },
    {
      $id: 'PR',
      type: 'object',
      properties: { c: { type: 'string' } },
      required: ['c'],
      additionalProperties: false
    },
    {
      $id: 'DR',
      type: 'object',
      properties: { d: { type: 'string' } },
      required: ['d'],
      additionalProperties: false
    },
    { $id: 'fullExampleExclusiveQueryResponse', type: 'number' },
    { $id: 'fullExampleUsingBodyResponse', type: 'number' }
  ],
  imports: [
    "import AuthParam from './helpers/auth-param';",
    "import '@fastify/cookie';",
    "import * as ResponseTypesController from './routes/response-types';",
    "import * as WsController from './routes/ws';",
    "import * as $name$Controller from './routes/[name]';"
  ]
};