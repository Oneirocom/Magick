export type Model = {
  model_name: string
  display_name: string
  max_context_window: number
  input_cost: number
  output_cost: number
  rate_limit: number
  provider: {
    provider_name: string
    provider_id: string
    api_key: string
    moderation: 'Filtered'
    extra_kwargs: any
  }
}
