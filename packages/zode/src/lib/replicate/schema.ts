import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core'
import { z } from 'zod'

const deployments_create_Body = z
  .object({
    hardware: z.string(),
    max_instances: z.number().int().gte(0).lte(20),
    min_instances: z.number().int().gte(0).lte(5),
    model: z.string(),
    name: z.string(),
    version: z.string(),
  })
  .passthrough()
const deployments_update_Body = z
  .object({
    hardware: z.string(),
    max_instances: z.number().int().gte(0).lte(20),
    min_instances: z.number().int().gte(0).lte(5),
    version: z.string(),
  })
  .partial()
  .passthrough()
const prediction_request = z.object({
  input: z.object({}).partial().passthrough(),
  stream: z.boolean().optional(),
  webhook: z.string().optional(),
  webhook_events_filter: z
    .array(z.enum(['start', 'output', 'logs', 'completed']))
    .optional(),
})
const models_create_Body = z
  .object({
    cover_image_url: z.string().optional(),
    description: z.string().optional(),
    github_url: z.string().optional(),
    hardware: z.string(),
    license_url: z.string().optional(),
    name: z.string(),
    owner: z.string(),
    paper_url: z.string().optional(),
    visibility: z.enum(['public', 'private']),
  })
  .passthrough()
const training_request = z
  .object({
    destination: z.string(),
    input: z.object({}).partial().passthrough(),
    webhook: z.string().optional(),
    webhook_events_filter: z
      .array(z.enum(['start', 'output', 'logs', 'completed']))
      .optional(),
  })
  .passthrough()
const version_prediction_request = z.object({
  input: z.object({}).partial().passthrough(),
  stream: z.boolean().optional(),
  version: z.string(),
  webhook: z.string().optional(),
  webhook_events_filter: z
    .array(z.enum(['start', 'output', 'logs', 'completed']))
    .optional(),
})

export const schemas = {
  deployments_create_Body,
  deployments_update_Body,
  prediction_request,
  models_create_Body,
  training_request,
  version_prediction_request,
}

export const endpoints = makeApi([
  {
    method: 'get',
    path: '/account',
    alias: 'account.get',
    description: `Returns information about the user or organization associated with the provided API token.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/account
&#x60;&#x60;&#x60;

The response will be a JSON object describing the account:

&#x60;&#x60;&#x60;json
{
  &quot;type&quot;: &quot;organization&quot;,
  &quot;username&quot;: &quot;acme&quot;,
  &quot;name&quot;: &quot;Acme Corp, Inc.&quot;,
  &quot;github_url&quot;: &quot;https://github.com/acme&quot;,
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    response: z
      .object({
        github_url: z.string().url(),
        name: z.string(),
        type: z.enum(['organization', 'user']),
        username: z.string(),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'get',
    path: '/collections',
    alias: 'collections.list',
    description: `Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/collections
&#x60;&#x60;&#x60;

The response will be a paginated JSON list of collection objects:

&#x60;&#x60;&#x60;json
{
  &quot;next&quot;: &quot;null&quot;,
  &quot;previous&quot;: null,
  &quot;results&quot;: [
    {
      &quot;name&quot;: &quot;Super resolution&quot;,
      &quot;slug&quot;: &quot;super-resolution&quot;,
      &quot;description&quot;: &quot;Upscaling models that create high-quality images from low-quality images.&quot;
    }
  ]
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/collections/:collection_slug',
    alias: 'collections.get',
    description: `Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/collections/super-resolution
&#x60;&#x60;&#x60;

The response will be a collection object with a nested list of the models in that collection:

&#x60;&#x60;&#x60;json
{
  &quot;name&quot;: &quot;Super resolution&quot;,
  &quot;slug&quot;: &quot;super-resolution&quot;,
  &quot;description&quot;: &quot;Upscaling models that create high-quality images from low-quality images.&quot;,
  &quot;models&quot;: [...]
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'collection_slug',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/deployments',
    alias: 'deployments.list',
    description: `Get a list of deployments associated with the current account, including the latest release configuration for each deployment.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/deployments
&#x60;&#x60;&#x60;

The response will be a paginated JSON array of deployment objects, sorted with the most recent deployment first:

&#x60;&#x60;&#x60;json
{
  &quot;next&quot;: &quot;http://api.replicate.com/v1/deployments?cursor&#x3D;cD0yMDIzLTA2LTA2KzIzJTNBNDAlM0EwOC45NjMwMDAlMkIwMCUzQTAw&quot;,
  &quot;previous&quot;: null,
  &quot;results&quot;: [
    {
      &quot;owner&quot;: &quot;replicate&quot;,
      &quot;name&quot;: &quot;my-app-image-generator&quot;,
      &quot;current_release&quot;: {
        &quot;number&quot;: 1,
        &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
        &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
        &quot;created_at&quot;: &quot;2024-02-15T16:32:57.018467Z&quot;,
        &quot;created_by&quot;: {
          &quot;type&quot;: &quot;organization&quot;,
          &quot;username&quot;: &quot;acme&quot;,
          &quot;name&quot;: &quot;Acme Corp, Inc.&quot;,
          &quot;github_url&quot;: &quot;https://github.com/acme&quot;,
        },
        &quot;configuration&quot;: {
          &quot;hardware&quot;: &quot;gpu-t4&quot;,
          &quot;min_instances&quot;: 1,
          &quot;max_instances&quot;: 5
        }
      }
    }
  ]
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    response: z
      .object({
        next: z.string().nullable(),
        previous: z.string().nullable(),
        results: z.array(
          z
            .object({
              current_release: z
                .object({
                  configuration: z
                    .object({
                      hardware: z.string(),
                      max_instances: z.number().int(),
                      min_instances: z.number().int(),
                    })
                    .partial()
                    .passthrough(),
                  created_at: z.string().datetime({ offset: true }),
                  created_by: z
                    .object({
                      github_url: z.string().url(),
                      name: z.string(),
                      type: z.enum(['organization', 'user']),
                      username: z.string(),
                    })
                    .partial()
                    .passthrough(),
                  model: z.string(),
                  number: z.number().int(),
                  version: z.string(),
                })
                .partial()
                .passthrough(),
              name: z.string(),
              owner: z.string(),
            })
            .partial()
            .passthrough()
        ),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'post',
    path: '/deployments',
    alias: 'deployments.create',
    description: `Create a new deployment:

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -X POST \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  -H &quot;Content-Type: application/json&quot; \
  -d &#x27;{
        &quot;name&quot;: &quot;my-app-image-generator&quot;,
        &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
        &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
        &quot;hardware&quot;: &quot;gpu-t4&quot;,
        &quot;min_instances&quot;: 0,
        &quot;max_instances&quot;: 3
      }&#x27; \
  https://api.replicate.com/v1/deployments
&#x60;&#x60;&#x60;

The response will be a JSON object describing the deployment:

&#x60;&#x60;&#x60;json
{
  &quot;owner&quot;: &quot;acme&quot;,
  &quot;name&quot;: &quot;my-app-image-generator&quot;,
  &quot;current_release&quot;: {
    &quot;number&quot;: 1,
    &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
    &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
    &quot;created_at&quot;: &quot;2024-02-15T16:32:57.018467Z&quot;,
    &quot;created_by&quot;: {
      &quot;type&quot;: &quot;organization&quot;,
      &quot;username&quot;: &quot;acme&quot;,
      &quot;name&quot;: &quot;Acme Corp, Inc.&quot;,
      &quot;github_url&quot;: &quot;https://github.com/acme&quot;,
    },
    &quot;configuration&quot;: {
      &quot;hardware&quot;: &quot;gpu-t4&quot;,
      &quot;min_instances&quot;: 1,
      &quot;max_instances&quot;: 5
    }
  }
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: deployments_create_Body,
      },
    ],
    response: z
      .object({
        current_release: z
          .object({
            configuration: z
              .object({
                hardware: z.string(),
                max_instances: z.number().int(),
                min_instances: z.number().int(),
              })
              .partial()
              .passthrough(),
            created_at: z.string().datetime({ offset: true }),
            created_by: z
              .object({
                github_url: z.string().url(),
                name: z.string(),
                type: z.enum(['organization', 'user']),
                username: z.string(),
              })
              .partial()
              .passthrough(),
            model: z.string(),
            number: z.number().int(),
            version: z.string(),
          })
          .partial()
          .passthrough(),
        name: z.string(),
        owner: z.string(),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'delete',
    path: '/deployments/:deployment_owner/:deployment_name',
    alias: 'deployments.delete',
    description: `Delete a deployment

Deployment deletion has some restrictions:

- You can only delete deployments that have been offline and unused for at least 15 minutes.

Example cURL request:

&#x60;&#x60;&#x60;command
curl -s -X DELETE \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/deployments/acme/my-app-image-generator
&#x60;&#x60;&#x60;

The response will be an empty 204, indicating the deployment has been deleted.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'deployment_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'deployment_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/deployments/:deployment_owner/:deployment_name',
    alias: 'deployments.get',
    description: `Get information about a deployment by name including the current release.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/deployments/replicate/my-app-image-generator
&#x60;&#x60;&#x60;

The response will be a JSON object describing the deployment:

&#x60;&#x60;&#x60;json
{
  &quot;owner&quot;: &quot;acme&quot;,
  &quot;name&quot;: &quot;my-app-image-generator&quot;,
  &quot;current_release&quot;: {
    &quot;number&quot;: 1,
    &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
    &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
    &quot;created_at&quot;: &quot;2024-02-15T16:32:57.018467Z&quot;,
    &quot;created_by&quot;: {
      &quot;type&quot;: &quot;organization&quot;,
      &quot;username&quot;: &quot;acme&quot;,
      &quot;name&quot;: &quot;Acme Corp, Inc.&quot;,
      &quot;github_url&quot;: &quot;https://github.com/acme&quot;,
    },
    &quot;configuration&quot;: {
      &quot;hardware&quot;: &quot;gpu-t4&quot;,
      &quot;min_instances&quot;: 1,
      &quot;max_instances&quot;: 5
    }
  }
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'deployment_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'deployment_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({
        current_release: z
          .object({
            configuration: z
              .object({
                hardware: z.string(),
                max_instances: z.number().int(),
                min_instances: z.number().int(),
              })
              .partial()
              .passthrough(),
            created_at: z.string().datetime({ offset: true }),
            created_by: z
              .object({
                github_url: z.string().url(),
                name: z.string(),
                type: z.enum(['organization', 'user']),
                username: z.string(),
              })
              .partial()
              .passthrough(),
            model: z.string(),
            number: z.number().int(),
            version: z.string(),
          })
          .partial()
          .passthrough(),
        name: z.string(),
        owner: z.string(),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'patch',
    path: '/deployments/:deployment_owner/:deployment_name',
    alias: 'deployments.update',
    description: `Update properties of an existing deployment, including hardware, min/max instances, and the deployment&#x27;s underlying model [version](https://replicate.com/docs/how-does-replicate-work#versions).

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -X PATCH \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  -H &quot;Content-Type: application/json&quot; \
  -d &#x27;{&quot;min_instances&quot;: 3, &quot;max_instances&quot;: 10}&#x27; \
  https://api.replicate.com/v1/deployments/acme/my-app-image-generator
&#x60;&#x60;&#x60;

The response will be a JSON object describing the deployment:

&#x60;&#x60;&#x60;json
{
  &quot;owner&quot;: &quot;acme&quot;,
  &quot;name&quot;: &quot;my-app-image-generator&quot;,
  &quot;current_release&quot;: {
    &quot;number&quot;: 2,
    &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
    &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
    &quot;created_at&quot;: &quot;2024-02-15T16:32:57.018467Z&quot;,
    &quot;created_by&quot;: {
      &quot;type&quot;: &quot;organization&quot;,
      &quot;username&quot;: &quot;acme&quot;,
      &quot;name&quot;: &quot;Acme Corp, Inc.&quot;,
      &quot;github_url&quot;: &quot;https://github.com/acme&quot;,
    },
    &quot;configuration&quot;: {
      &quot;hardware&quot;: &quot;gpu-t4&quot;,
      &quot;min_instances&quot;: 3,
      &quot;max_instances&quot;: 10
    }
  }
}
&#x60;&#x60;&#x60;

Updating any deployment properties will increment the &#x60;number&#x60; field of the &#x60;current_release&#x60;.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: deployments_update_Body,
      },
      {
        name: 'deployment_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'deployment_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z
      .object({
        current_release: z
          .object({
            configuration: z
              .object({
                hardware: z.string(),
                max_instances: z.number().int(),
                min_instances: z.number().int(),
              })
              .partial()
              .passthrough(),
            created_at: z.string().datetime({ offset: true }),
            created_by: z
              .object({
                github_url: z.string().url(),
                name: z.string(),
                type: z.enum(['organization', 'user']),
                username: z.string(),
              })
              .partial()
              .passthrough(),
            model: z.string(),
            number: z.number().int(),
            version: z.string(),
          })
          .partial()
          .passthrough(),
        name: z.string(),
        owner: z.string(),
      })
      .partial()
      .passthrough(),
  },
  {
    method: 'post',
    path: '/deployments/:deployment_owner/:deployment_name/predictions',
    alias: 'deployments.predictions.create',
    description: `Start a new prediction for a deployment of a model using inputs you provide.

Example request body:

&#x60;&#x60;&#x60;json
{
  &quot;input&quot;: {
    &quot;text&quot;: &quot;Alice&quot;
  }
}
&#x60;&#x60;&#x60;

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s -X POST \
  -d &#x27;{&quot;input&quot;: {&quot;text&quot;: &quot;Alice&quot;}}&#x27; \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  -H &#x27;Content-Type: application/json&#x27; \
  &quot;https://api.replicate.com/v1/deployments/replicate/hello-world/predictions&quot;
&#x60;&#x60;&#x60;

The response will be the prediction object:

&#x60;&#x60;&#x60;json
{
  &quot;id&quot;: &quot;86b6trbv99rgp0cf1h886f69ew&quot;,
  &quot;model&quot;: &quot;replicate/hello-world&quot;,
  &quot;version&quot;: &quot;dp-8e43d61c333b5ddc7a921130bc3ab3ea&quot;,
  &quot;input&quot;: {
    &quot;text&quot;: &quot;Alice&quot;
  },
  &quot;logs&quot;: &quot;&quot;,
  &quot;error&quot;: null,
  &quot;status&quot;: &quot;starting&quot;,
  &quot;created_at&quot;: &quot;2024-04-23T18:55:52.138Z&quot;,
  &quot;urls&quot;: {
    &quot;cancel&quot;: &quot;https://api.replicate.com/v1/predictions/86b6trbv99rgp0cf1h886f69ew/cancel&quot;,
    &quot;get&quot;: &quot;https://api.replicate.com/v1/predictions/86b6trbv99rgp0cf1h886f69ew&quot;
  }
}
&#x60;&#x60;&#x60;

As models can take several seconds or more to run, the output will not be available immediately. To get the final result of the prediction you should either provide a &#x60;webhook&#x60; HTTPS URL for us to call when the results are ready, or poll the [get a prediction](#predictions.get) endpoint until it has finished.

Input and output (including any files) will be automatically deleted after an hour, so you must save a copy of any files in the output if you&#x27;d like to continue using them.

Output files are served by &#x60;replicate.delivery&#x60; and its subdomains. If you use an allow list of external domains for your assets, add &#x60;replicate.delivery&#x60; and &#x60;*.replicate.delivery&#x60; to it.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: prediction_request,
      },
      {
        name: 'deployment_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'deployment_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/hardware',
    alias: 'hardware.list',
    description: `Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/hardware
&#x60;&#x60;&#x60;

The response will be a JSON array of hardware objects:

&#x60;&#x60;&#x60;json
[
    {&quot;name&quot;: &quot;CPU&quot;, &quot;sku&quot;: &quot;cpu&quot;},
    {&quot;name&quot;: &quot;Nvidia T4 GPU&quot;, &quot;sku&quot;: &quot;gpu-t4&quot;},
    {&quot;name&quot;: &quot;Nvidia A40 GPU&quot;, &quot;sku&quot;: &quot;gpu-a40-small&quot;},
    {&quot;name&quot;: &quot;Nvidia A40 (Large) GPU&quot;, &quot;sku&quot;: &quot;gpu-a40-large&quot;},
]
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    response: z.array(
      z.object({ name: z.string(), sku: z.string() }).partial().passthrough()
    ),
  },
  {
    method: 'get',
    path: '/models',
    alias: 'models.list',
    description: `Get a paginated list of public models.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/models
&#x60;&#x60;&#x60;

The response will be a paginated JSON array of model objects:

&#x60;&#x60;&#x60;json
{
  &quot;next&quot;: null,
  &quot;previous&quot;: null,
  &quot;results&quot;: [
    {
      &quot;url&quot;: &quot;https://replicate.com/acme/hello-world&quot;,
      &quot;owner&quot;: &quot;acme&quot;,
      &quot;name&quot;: &quot;hello-world&quot;,
      &quot;description&quot;: &quot;A tiny model that says hello&quot;,
      &quot;visibility&quot;: &quot;public&quot;,
      &quot;github_url&quot;: &quot;https://github.com/replicate/cog-examples&quot;,
      &quot;paper_url&quot;: null,
      &quot;license_url&quot;: null,
      &quot;run_count&quot;: 5681081,
      &quot;cover_image_url&quot;: &quot;...&quot;,
      &quot;default_example&quot;: {...},
      &quot;latest_version&quot;: {...}
    }
  ]
}
&#x60;&#x60;&#x60;

The &#x60;cover_image_url&#x60; string is an HTTPS URL for an image file. This can be:

- An image uploaded by the model author.
- The output file of the example prediction, if the model author has not set a cover image.
- The input file of the example prediction, if the model author has not set a cover image and the example prediction has no output file.
- A generic fallback image.
`,
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/models',
    alias: 'models.create',
    description: `Create a model.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s -X POST \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  -H &#x27;Content-Type: application/json&#x27; \
  -d &#x27;{&quot;owner&quot;: &quot;alice&quot;, &quot;name&quot;: &quot;my-model&quot;, &quot;description&quot;: &quot;An example model&quot;, &quot;visibility&quot;: &quot;public&quot;, &quot;hardware&quot;: &quot;cpu&quot;}&#x27; \
  https://api.replicate.com/v1/models
&#x60;&#x60;&#x60;

The response will be a model object in the following format:

&#x60;&#x60;&#x60;json
{
  &quot;url&quot;: &quot;https://replicate.com/alice/my-model&quot;,
  &quot;owner&quot;: &quot;alice&quot;,
  &quot;name&quot;: &quot;my-model&quot;,
  &quot;description&quot;: &quot;An example model&quot;,
  &quot;visibility&quot;: &quot;public&quot;,
  &quot;github_url&quot;: null,
  &quot;paper_url&quot;: null,
  &quot;license_url&quot;: null,
  &quot;run_count&quot;: 0,
  &quot;cover_image_url&quot;: null,
  &quot;default_example&quot;: null,
  &quot;latest_version&quot;: null,
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: models_create_Body,
      },
    ],
    response: z.void(),
  },
  {
    method: 'delete',
    path: '/models/:model_owner/:model_name',
    alias: 'models.delete',
    description: `Delete a model

Model deletion has some restrictions:

- You can only delete models you own.
- You can only delete private models.
- You can only delete models that have no versions associated with them. Currently you&#x27;ll need to [delete the model&#x27;s versions](#models.versions.delete) before you can delete the model itself.

Example cURL request:

&#x60;&#x60;&#x60;command
curl -s -X DELETE \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/models/replicate/hello-world
&#x60;&#x60;&#x60;

The response will be an empty 204, indicating the model has been deleted.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'model_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'model_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/models/:model_owner/:model_name',
    alias: 'models.get',
    description: `Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/models/replicate/hello-world
&#x60;&#x60;&#x60;

The response will be a model object in the following format:

&#x60;&#x60;&#x60;json
{
  &quot;url&quot;: &quot;https://replicate.com/replicate/hello-world&quot;,
  &quot;owner&quot;: &quot;replicate&quot;,
  &quot;name&quot;: &quot;hello-world&quot;,
  &quot;description&quot;: &quot;A tiny model that says hello&quot;,
  &quot;visibility&quot;: &quot;public&quot;,
  &quot;github_url&quot;: &quot;https://github.com/replicate/cog-examples&quot;,
  &quot;paper_url&quot;: null,
  &quot;license_url&quot;: null,
  &quot;run_count&quot;: 5681081,
  &quot;cover_image_url&quot;: &quot;...&quot;,
  &quot;default_example&quot;: {...},
  &quot;latest_version&quot;: {...},
}
&#x60;&#x60;&#x60;

The &#x60;cover_image_url&#x60; string is an HTTPS URL for an image file. This can be:

- An image uploaded by the model author.
- The output file of the example prediction, if the model author has not set a cover image.
- The input file of the example prediction, if the model author has not set a cover image and the example prediction has no output file.
- A generic fallback image.

The &#x60;default_example&#x60; object is a [prediction](#predictions.get) created with this model.

The &#x60;latest_version&#x60; object is the model&#x27;s most recently pushed [version](#models.versions.get).
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'model_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'model_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/models/:model_owner/:model_name/predictions',
    alias: 'models.predictions.create',
    description: `Start a new prediction for an official model using the inputs you provide.

Example request body:

&#x60;&#x60;&#x60;json
{
  &quot;input&quot;: {
    &quot;prompt&quot;: &quot;Write a short poem about the weather.&quot;
  }
}
&#x60;&#x60;&#x60;

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s -X POST \
  -d &#x27;{&quot;input&quot;: {&quot;prompt&quot;: &quot;Write a short poem about the weather.&quot;}}&#x27; \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  -H &#x27;Content-Type: application/json&#x27; \
  https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions
&#x60;&#x60;&#x60;

The response will be the prediction object:

&#x60;&#x60;&#x60;json
{
  &quot;id&quot;: &quot;25s2s4n7rdrgg0cf1httb3myk0&quot;,
  &quot;model&quot;: &quot;replicate-internal/llama3-70b-chat-vllm-unquantized&quot;,
  &quot;version&quot;: &quot;dp-cf04fe09351e25db628e8b6181276547&quot;,
  &quot;input&quot;: {
    &quot;prompt&quot;: &quot;Write a short poem about the weather.&quot;
  },
  &quot;logs&quot;: &quot;&quot;,
  &quot;error&quot;: null,
  &quot;status&quot;: &quot;starting&quot;,
  &quot;created_at&quot;: &quot;2024-04-23T19:36:28.355Z&quot;,
  &quot;urls&quot;: {
    &quot;cancel&quot;: &quot;https://api.replicate.com/v1/predictions/25s2s4n7rdrgg0cf1httb3myk0/cancel&quot;,
    &quot;get&quot;: &quot;https://api.replicate.com/v1/predictions/25s2s4n7rdrgg0cf1httb3myk0&quot;
  }
}
&#x60;&#x60;&#x60;

As models can take several seconds or more to run, the output will not be available immediately. To get the final result of the prediction you should either provide a &#x60;webhook&#x60; HTTPS URL for us to call when the results are ready, or poll the [get a prediction](#predictions.get) endpoint until it has finished.

Input and output (including any files) will be automatically deleted after an hour, so you must save a copy of any files in the output if you&#x27;d like to continue using them.

Output files are served by &#x60;replicate.delivery&#x60; and its subdomains. If you use an allow list of external domains for your assets, add &#x60;replicate.delivery&#x60; and &#x60;*.replicate.delivery&#x60; to it.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: prediction_request,
      },
      {
        name: 'model_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'model_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/models/:model_owner/:model_name/versions',
    alias: 'models.versions.list',
    description: `Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/models/replicate/hello-world/versions
&#x60;&#x60;&#x60;

The response will be a JSON array of model version objects, sorted with the most recent version first:

&#x60;&#x60;&#x60;json
{
  &quot;next&quot;: null,
  &quot;previous&quot;: null,
  &quot;results&quot;: [
    {
      &quot;id&quot;: &quot;5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa&quot;,
      &quot;created_at&quot;: &quot;2022-04-26T19:29:04.418669Z&quot;,
      &quot;cog_version&quot;: &quot;0.3.0&quot;,
      &quot;openapi_schema&quot;: {...}
    }
  ]
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'model_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'model_name',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'delete',
    path: '/models/:model_owner/:model_name/versions/:version_id',
    alias: 'models.versions.delete',
    description: `Delete a model version and all associated predictions, including all output files.

Model version deletion has some restrictions:

- You can only delete versions from models you own.
- You can only delete versions from private models.
- You cannot delete a version if someone other than you has run predictions with it.
- You cannot delete a version if it is being used as the base model for a fine tune/training.
- You cannot delete a version if it has an associated deployment.
- You cannot delete a version if another model version is overridden to use it.

Example cURL request:

&#x60;&#x60;&#x60;command
curl -s -X DELETE \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/models/replicate/hello-world/versions/5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa
&#x60;&#x60;&#x60;

The response will be an empty 202, indicating the deletion request has been accepted. It might take a few minutes to be processed.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'model_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'model_name',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'version_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/models/:model_owner/:model_name/versions/:version_id',
    alias: 'models.versions.get',
    description: `Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/models/replicate/hello-world/versions/5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa
&#x60;&#x60;&#x60;

The response will be the version object:

&#x60;&#x60;&#x60;json
{
  &quot;id&quot;: &quot;5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa&quot;,
  &quot;created_at&quot;: &quot;2022-04-26T19:29:04.418669Z&quot;,
  &quot;cog_version&quot;: &quot;0.3.0&quot;,
  &quot;openapi_schema&quot;: {...}
}
&#x60;&#x60;&#x60;

Every model describes its inputs and outputs with [OpenAPI Schema Objects](https://spec.openapis.org/oas/latest.html#schemaObject) in the &#x60;openapi_schema&#x60; property.

The &#x60;openapi_schema.components.schemas.Input&#x60; property for the [replicate/hello-world](https://replicate.com/replicate/hello-world) model looks like this:

&#x60;&#x60;&#x60;json
{
  &quot;type&quot;: &quot;object&quot;,
  &quot;title&quot;: &quot;Input&quot;,
  &quot;required&quot;: [
    &quot;text&quot;
  ],
  &quot;properties&quot;: {
    &quot;text&quot;: {
      &quot;x-order&quot;: 0,
      &quot;type&quot;: &quot;string&quot;,
      &quot;title&quot;: &quot;Text&quot;,
      &quot;description&quot;: &quot;Text to prefix with &#x27;hello &#x27;&quot;
    }
  }
}
&#x60;&#x60;&#x60;

The &#x60;openapi_schema.components.schemas.Output&#x60; property for the [replicate/hello-world](https://replicate.com/replicate/hello-world) model looks like this:

&#x60;&#x60;&#x60;json
{
  &quot;type&quot;: &quot;string&quot;,
  &quot;title&quot;: &quot;Output&quot;
}
&#x60;&#x60;&#x60;

For more details, see the docs on [Cog&#x27;s supported input and output types](https://github.com/replicate/cog/blob/75b7802219e7cd4cee845e34c4c22139558615d4/docs/python.md#input-and-output-types)
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'model_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'model_name',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'version_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/models/:model_owner/:model_name/versions/:version_id/trainings',
    alias: 'trainings.create',
    description: `Start a new training of the model version you specify.

Example request body:

&#x60;&#x60;&#x60;json
{
  &quot;destination&quot;: &quot;{new_owner}/{new_name}&quot;,
  &quot;input&quot;: {
    &quot;train_data&quot;: &quot;https://example.com/my-input-images.zip&quot;,
  },
  &quot;webhook&quot;: &quot;https://example.com/my-webhook&quot;,
}
&#x60;&#x60;&#x60;

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s -X POST \
  -d &#x27;{&quot;destination&quot;: &quot;{new_owner}/{new_name}&quot;, &quot;input&quot;: {&quot;input_images&quot;: &quot;https://example.com/my-input-images.zip&quot;}}&#x27; \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  -H &#x27;Content-Type: application/json&#x27; \
  https://api.replicate.com/v1/models/stability-ai/sdxl/versions/da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf/trainings
&#x60;&#x60;&#x60;

The response will be the training object:

&#x60;&#x60;&#x60;json
{
  &quot;id&quot;: &quot;zz4ibbonubfz7carwiefibzgga&quot;,
  &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
  &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
  &quot;input&quot;: {
    &quot;input_images&quot;: &quot;https://example.com/my-input-images.zip&quot;
  },
  &quot;logs&quot;: &quot;&quot;,
  &quot;error&quot;: null,
  &quot;status&quot;: &quot;starting&quot;,
  &quot;created_at&quot;: &quot;2023-09-08T16:32:56.990893084Z&quot;,
  &quot;urls&quot;: {
    &quot;cancel&quot;: &quot;https://api.replicate.com/v1/predictions/zz4ibbonubfz7carwiefibzgga/cancel&quot;,
    &quot;get&quot;: &quot;https://api.replicate.com/v1/predictions/zz4ibbonubfz7carwiefibzgga&quot;
  }
}
&#x60;&#x60;&#x60;

As models can take several minutes or more to train, the result will not be available immediately. To get the final result of the training you should either provide a &#x60;webhook&#x60; HTTPS URL for us to call when the results are ready, or poll the [get a training](#trainings.get) endpoint until it has finished.

When a training completes, it creates a new [version](https://replicate.com/docs/how-does-replicate-work#terminology) of the model at the specified destination.

To find some models to train on, check out the [trainable language models collection](https://replicate.com/collections/trainable-language-models).
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: training_request,
      },
      {
        name: 'model_owner',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'model_name',
        type: 'Path',
        schema: z.string(),
      },
      {
        name: 'version_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/predictions',
    alias: 'predictions.list',
    description: `Get a paginated list of predictions that you&#x27;ve created. This will include predictions created from the API and the website. It will return 100 records per page.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/predictions
&#x60;&#x60;&#x60;

The response will be a paginated JSON array of prediction objects, sorted with the most recent prediction first:

&#x60;&#x60;&#x60;json
{
  &quot;next&quot;: null,
  &quot;previous&quot;: null,
  &quot;results&quot;: [
    {
      &quot;completed_at&quot;: &quot;2023-09-08T16:19:34.791859Z&quot;,
      &quot;created_at&quot;: &quot;2023-09-08T16:19:34.907244Z&quot;,
      &quot;data_removed&quot;: false,
      &quot;error&quot;: null,
      &quot;id&quot;: &quot;gm3qorzdhgbfurvjtvhg6dckhu&quot;,
      &quot;input&quot;: {
        &quot;text&quot;: &quot;Alice&quot;
      },
      &quot;metrics&quot;: {
        &quot;predict_time&quot;: 0.012683
      },
      &quot;output&quot;: &quot;hello Alice&quot;,
      &quot;started_at&quot;: &quot;2023-09-08T16:19:34.779176Z&quot;,
      &quot;source&quot;: &quot;api&quot;,
      &quot;status&quot;: &quot;succeeded&quot;,
      &quot;urls&quot;: {
        &quot;get&quot;: &quot;https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu&quot;,
        &quot;cancel&quot;: &quot;https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu/cancel&quot;
      },
      &quot;model&quot;: &quot;replicate/hello-world&quot;,
      &quot;version&quot;: &quot;5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa&quot;,
    }
  ]
}
&#x60;&#x60;&#x60;

&#x60;id&#x60; will be the unique ID of the prediction.

&#x60;source&#x60; will indicate how the prediction was created. Possible values are &#x60;web&#x60; or &#x60;api&#x60;.

&#x60;status&#x60; will be the status of the prediction. Refer to [get a single prediction](#predictions.get) for possible values.

&#x60;urls&#x60; will be a convenience object that can be used to construct new API requests for the given prediction.

&#x60;model&#x60; will be the model identifier string in the format of &#x60;{model_owner}/{model_name}&#x60;.

&#x60;version&#x60; will be the unique ID of model version used to create the prediction.

&#x60;data_removed&#x60; will be &#x60;true&#x60; if the input and output data has been deleted.
`,
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/predictions',
    alias: 'predictions.create',
    description: `Start a new prediction for the model version and inputs you provide.

Example request body:

&#x60;&#x60;&#x60;json
{
  &quot;version&quot;: &quot;5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa&quot;,
  &quot;input&quot;: {
    &quot;text&quot;: &quot;Alice&quot;
  }
}
&#x60;&#x60;&#x60;

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s -X POST \
  -d &#x27;{&quot;version&quot;: &quot;5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa&quot;, &quot;input&quot;: {&quot;text&quot;: &quot;Alice&quot;}}&#x27; \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  -H &#x27;Content-Type: application/json&#x27; \
  https://api.replicate.com/v1/predictions
&#x60;&#x60;&#x60;

The response will be the prediction object:

&#x60;&#x60;&#x60;json
{
  &quot;id&quot;: &quot;gm3qorzdhgbfurvjtvhg6dckhu&quot;,
  &quot;model&quot;: &quot;replicate/hello-world&quot;,
  &quot;version&quot;: &quot;5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa&quot;,
  &quot;input&quot;: {
    &quot;text&quot;: &quot;Alice&quot;
  },
  &quot;logs&quot;: &quot;&quot;,
  &quot;error&quot;: null,
  &quot;status&quot;: &quot;starting&quot;,
  &quot;created_at&quot;: &quot;2023-09-08T16:19:34.765994657Z&quot;,
  &quot;urls&quot;: {
    &quot;cancel&quot;: &quot;https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu/cancel&quot;,
    &quot;get&quot;: &quot;https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu&quot;
  }
}
&#x60;&#x60;&#x60;

As models can take several seconds or more to run, the output will not be available immediately. To get the final result of the prediction you should either provide a &#x60;webhook&#x60; HTTPS URL for us to call when the results are ready, or poll the [get a prediction](#predictions.get) endpoint until it has finished.

Input and output (including any files) will be automatically deleted after an hour, so you must save a copy of any files in the output if you&#x27;d like to continue using them.

Output files are served by &#x60;replicate.delivery&#x60; and its subdomains. If you use an allow list of external domains for your assets, add &#x60;replicate.delivery&#x60; and &#x60;*.replicate.delivery&#x60; to it.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: version_prediction_request,
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/predictions/:prediction_id',
    alias: 'predictions.get',
    description: `Get the current state of a prediction.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu
&#x60;&#x60;&#x60;

The response will be the prediction object:

&#x60;&#x60;&#x60;json
{
  &quot;id&quot;: &quot;gm3qorzdhgbfurvjtvhg6dckhu&quot;,
  &quot;model&quot;: &quot;replicate/hello-world&quot;,
  &quot;version&quot;: &quot;5c7d5dc6dd8bf75c1acaa8565735e7986bc5b66206b55cca93cb72c9bf15ccaa&quot;,
  &quot;input&quot;: {
    &quot;text&quot;: &quot;Alice&quot;
  },
  &quot;logs&quot;: &quot;&quot;,
  &quot;output&quot;: &quot;hello Alice&quot;,
  &quot;error&quot;: null,
  &quot;status&quot;: &quot;succeeded&quot;,
  &quot;created_at&quot;: &quot;2023-09-08T16:19:34.765994Z&quot;,
  &quot;data_removed&quot;: false,
  &quot;started_at&quot;: &quot;2023-09-08T16:19:34.779176Z&quot;,
  &quot;completed_at&quot;: &quot;2023-09-08T16:19:34.791859Z&quot;,
  &quot;metrics&quot;: {
    &quot;predict_time&quot;: 0.012683
  },
  &quot;urls&quot;: {
    &quot;cancel&quot;: &quot;https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu/cancel&quot;,
    &quot;get&quot;: &quot;https://api.replicate.com/v1/predictions/gm3qorzdhgbfurvjtvhg6dckhu&quot;
  }
}
&#x60;&#x60;&#x60;

&#x60;status&#x60; will be one of:

- &#x60;starting&#x60;: the prediction is starting up. If this status lasts longer than a few seconds, then it&#x27;s typically because a new worker is being started to run the prediction.
- &#x60;processing&#x60;: the &#x60;predict()&#x60; method of the model is currently running.
- &#x60;succeeded&#x60;: the prediction completed successfully.
- &#x60;failed&#x60;: the prediction encountered an error during processing.
- &#x60;canceled&#x60;: the prediction was canceled by its creator.

In the case of success, &#x60;output&#x60; will be an object containing the output of the model. Any files will be represented as HTTPS URLs. You&#x27;ll need to pass the &#x60;Authorization&#x60; header to request them.

In the case of failure, &#x60;error&#x60; will contain the error encountered during the prediction.

Terminated predictions (with a status of &#x60;succeeded&#x60;, &#x60;failed&#x60;, or &#x60;canceled&#x60;) will include a &#x60;metrics&#x60; object with a &#x60;predict_time&#x60; property showing the amount of CPU or GPU time, in seconds, that the prediction used while running. It won&#x27;t include time waiting for the prediction to start.

Input and output (including any files) are automatically deleted after an hour, so you must save a copy of any files in the output if you&#x27;d like to continue using them.

Output files are served by &#x60;replicate.delivery&#x60; and its subdomains. If you use an allow list of external domains for your assets, add &#x60;replicate.delivery&#x60; and &#x60;*.replicate.delivery&#x60; to it.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'prediction_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/predictions/:prediction_id/cancel',
    alias: 'predictions.cancel',
    requestFormat: 'json',
    parameters: [
      {
        name: 'prediction_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/trainings',
    alias: 'trainings.list',
    description: `Get a paginated list of trainings that you&#x27;ve created. This will include trainings created from the API and the website. It will return 100 records per page.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/trainings
&#x60;&#x60;&#x60;

The response will be a paginated JSON array of training objects, sorted with the most recent training first:

&#x60;&#x60;&#x60;json
{
  &quot;next&quot;: null,
  &quot;previous&quot;: null,
  &quot;results&quot;: [
    {
      &quot;completed_at&quot;: &quot;2023-09-08T16:41:19.826523Z&quot;,
      &quot;created_at&quot;: &quot;2023-09-08T16:32:57.018467Z&quot;,
      &quot;error&quot;: null,
      &quot;id&quot;: &quot;zz4ibbonubfz7carwiefibzgga&quot;,
      &quot;input&quot;: {
        &quot;input_images&quot;: &quot;https://example.com/my-input-images.zip&quot;
      },
      &quot;metrics&quot;: {
        &quot;predict_time&quot;: 502.713876
      },
      &quot;output&quot;: {
        &quot;version&quot;: &quot;...&quot;,
        &quot;weights&quot;: &quot;...&quot;
      },
      &quot;started_at&quot;: &quot;2023-09-08T16:32:57.112647Z&quot;,
      &quot;source&quot;: &quot;api&quot;,
      &quot;status&quot;: &quot;succeeded&quot;,
      &quot;urls&quot;: {
        &quot;get&quot;: &quot;https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga&quot;,
        &quot;cancel&quot;: &quot;https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga/cancel&quot;
      },
      &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
      &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
    }
  ]
}
&#x60;&#x60;&#x60;

&#x60;id&#x60; will be the unique ID of the training.

&#x60;source&#x60; will indicate how the training was created. Possible values are &#x60;web&#x60; or &#x60;api&#x60;.

&#x60;status&#x60; will be the status of the training. Refer to [get a single training](#trainings.get) for possible values.

&#x60;urls&#x60; will be a convenience object that can be used to construct new API requests for the given training.

&#x60;version&#x60; will be the unique ID of model version used to create the training.
`,
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/trainings/:training_id',
    alias: 'trainings.get',
    description: `Get the current state of a training.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga
&#x60;&#x60;&#x60;

The response will be the training object:

&#x60;&#x60;&#x60;json
{
  &quot;completed_at&quot;: &quot;2023-09-08T16:41:19.826523Z&quot;,
  &quot;created_at&quot;: &quot;2023-09-08T16:32:57.018467Z&quot;,
  &quot;error&quot;: null,
  &quot;id&quot;: &quot;zz4ibbonubfz7carwiefibzgga&quot;,
  &quot;input&quot;: {
    &quot;input_images&quot;: &quot;https://example.com/my-input-images.zip&quot;
  },
  &quot;logs&quot;: &quot;...&quot;,
  &quot;metrics&quot;: {
    &quot;predict_time&quot;: 502.713876
  },
  &quot;output&quot;: {
    &quot;version&quot;: &quot;...&quot;,
    &quot;weights&quot;: &quot;...&quot;
  },
  &quot;started_at&quot;: &quot;2023-09-08T16:32:57.112647Z&quot;,
  &quot;status&quot;: &quot;succeeded&quot;,
  &quot;urls&quot;: {
    &quot;get&quot;: &quot;https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga&quot;,
    &quot;cancel&quot;: &quot;https://api.replicate.com/v1/trainings/zz4ibbonubfz7carwiefibzgga/cancel&quot;
  },
  &quot;model&quot;: &quot;stability-ai/sdxl&quot;,
  &quot;version&quot;: &quot;da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf&quot;,
}
&#x60;&#x60;&#x60;

&#x60;status&#x60; will be one of:

- &#x60;starting&#x60;: the training is starting up. If this status lasts longer than a few seconds, then it&#x27;s typically because a new worker is being started to run the training.
- &#x60;processing&#x60;: the &#x60;train()&#x60; method of the model is currently running.
- &#x60;succeeded&#x60;: the training completed successfully.
- &#x60;failed&#x60;: the training encountered an error during processing.
- &#x60;canceled&#x60;: the training was canceled by its creator.

In the case of success, &#x60;output&#x60; will be an object containing the output of the model. Any files will be represented as HTTPS URLs. You&#x27;ll need to pass the &#x60;Authorization&#x60; header to request them.

In the case of failure, &#x60;error&#x60; will contain the error encountered during the training.

Terminated trainings (with a status of &#x60;succeeded&#x60;, &#x60;failed&#x60;, or &#x60;canceled&#x60;) will include a &#x60;metrics&#x60; object with a &#x60;predict_time&#x60; property showing the amount of CPU or GPU time, in seconds, that the training used while running. It won&#x27;t include time waiting for the training to start.
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'training_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/trainings/:training_id/cancel',
    alias: 'trainings.cancel',
    requestFormat: 'json',
    parameters: [
      {
        name: 'training_id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/webhooks/default/secret',
    alias: 'webhooks.default.secret.get',
    description: `Get the signing secret for the default webhook endpoint. This is used to verify that webhook requests are coming from Replicate.

Example cURL request:

&#x60;&#x60;&#x60;console
curl -s \
  -H &quot;Authorization: Bearer &lt;paste-your-token-here&gt;&quot; \
  https://api.replicate.com/v1/webhooks/default/secret
&#x60;&#x60;&#x60;

The response will be a JSON object with a &#x60;key&#x60; property:

&#x60;&#x60;&#x60;json
{
  &quot;key&quot;: &quot;...&quot;
}
&#x60;&#x60;&#x60;
`,
    requestFormat: 'json',
    response: z.object({ key: z.string() }).partial().passthrough(),
  },
])

export const api = new Zodios(endpoints)

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options)
}
