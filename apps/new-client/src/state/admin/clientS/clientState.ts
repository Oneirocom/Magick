import {
  createSlice,
  createAsyncThunk,
  // PayloadAction
} from '@reduxjs/toolkit'
import ClientService from './clientService'

export interface Client {
  id: number
  client: string
  name: string
  type: string
  default_value: string
}
export interface ClientRes {
  message: String
  payload: {
    data: Client[]
    pages: number
    totalItems: number
  }
}

export interface State {
  client: ClientRes
  sclient: {
    message: string
    payload: {}
  }
  loading: boolean
  error: any
  success: boolean
  createSuccess: boolean
  updateSuccess: boolean
  deleteSuccess: boolean
}

const initialState: State = {
  client: { message: '', payload: { data: [], pages: 0, totalItems: 0 } },
  sclient: {
    message: '',
    payload: [],
  },
  loading: false,
  error: '',
  success: false,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
}
export const createClient = createAsyncThunk(
  'createClientSettings',
  async (data: {}, { rejectWithValue }) => {
    try {
      const res = await ClientService.create(data)
      return res.data
    } catch (error) {
      throw rejectWithValue(error.response.data.message)
    }
  }
)
export const retrieveClient = createAsyncThunk(
  'getClientSettings',
  async (data: { currentPage: number; page: number }) => {
    const res = await ClientService.getAll(data.currentPage, data.page)
    return res.data
  }
)

export const searchClient = createAsyncThunk(
  'searchsinglescope',
  async (search: string) => {
    const res = await ClientService.getOne(search)
    return res.data
  }
)

export const singleClient = createAsyncThunk(
  'getsingleconfiguration',
  async (id: number) => {
    const res = await ClientService.get(id)
    return res.data
  }
)
export const updateClient = createAsyncThunk(
  'updateClientSettings',
  async (
    data: {
      id: number
      formData: {
        client: string
        name: string
        type: string
        defaultValue: string
      }
    },
    { rejectWithValue }
  ) => {
    const { id, formData } = data

    try {
      const res = await ClientService.update(id, formData)
      return res.data
    } catch (error) {
      throw rejectWithValue(error.response.data.message)
    }
  }
)
export const deleteClient = createAsyncThunk(
  'deleteClientSettings',
  async (id: number) => {
    const res = await ClientService.delete(id)
    return res.data
  }
)

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createClient.pending, state => {
      state.loading = true
    })
    builder.addCase(createClient.fulfilled, state => {
      state.loading = false
      state.success = true
      state.error = ''
      state.createSuccess = true
    })
    builder.addCase(createClient.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(retrieveClient.pending, state => {
      state.loading = true
    })
    // : PayloadAction<[{ message:string; payload:[{id,key,value}] }]>
    builder.addCase(retrieveClient.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = ''
      state.deleteSuccess = false
      state.createSuccess = false
      state.updateSuccess = false
      state.client = action.payload
    })
    builder.addCase(retrieveClient.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(singleClient.pending, state => {
      state.loading = true
    })
    builder.addCase(singleClient.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.sclient = action.payload
    })
    builder.addCase(singleClient.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(updateClient.pending, state => {
      state.loading = true
    })
    builder.addCase(updateClient.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = ''
      state.updateSuccess = true
    })
    builder.addCase(updateClient.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(searchClient.pending, state => {
      state.loading = true
    })
    builder.addCase(searchClient.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.deleteSuccess = false
      state.createSuccess = false
      state.updateSuccess = false
      state.client = action.payload
    })
    builder.addCase(searchClient.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(deleteClient.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteClient.fulfilled, state => {
      state.loading = false
      state.success = true
      state.deleteSuccess = true
    })
    builder.addCase(deleteClient.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})
const { reducer } = clientSlice
export default reducer
