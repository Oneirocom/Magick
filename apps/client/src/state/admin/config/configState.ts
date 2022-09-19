import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Configservice from './configService'

export interface Config {
  id: number
  key: string
  value: string
}
export interface ConfigRes {
  message: String
  payload: {
    data: Config[]
    totalItems: number
  }
}

export interface State {
  config: ConfigRes
  sconfig: {
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
  config: {
    message: '',
    payload: { data: [], totalItems: 0 },
  },
  sconfig: {
    message: '',
    payload: [],
  },
  loading: false,
  error: {},
  success: false,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
}
export const createConfig = createAsyncThunk(
  'createconfiguration',
  async (data: {}, { rejectWithValue }) => {
    try {
      const res = await Configservice.create(data)
      return res
    } catch (error) {
      throw rejectWithValue(error.response.data.message)
    }
  }
)
export const retrieveConfig = createAsyncThunk(
  'getconfiguration',
  async (data: { currentPage: number; page: number }) => {
    const res = await Configservice.getAll(data.currentPage, data.page)
    return res.data
  }
)
export const SingleConfig = createAsyncThunk(
  'getsingleconfiguration',
  async (id: number) => {
    const res = await Configservice.get(id)
    return res.data
  }
)
export const updateConfig = createAsyncThunk(
  'updateConfiguration',
  async (
    data: { id: number; formData: { key: string; value: string } },
    { rejectWithValue }
  ) => {
    const { id, formData } = data
    try {
      const res = await Configservice.update(id, formData)
      return res.data
    } catch (error) {
      throw rejectWithValue(error.response.data.message)
    }
  }
)
export const deleteConfig = createAsyncThunk(
  'deleteConfiguration',
  async (id: number) => {
    const res = await Configservice.delete(id)
    return res.data
  }
)

export const searchConfig = createAsyncThunk(
  'searchsinglescope',
  async (search: string) => {
    const res = await Configservice.getOne(search)
    return res.data
  }
)

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createConfig.pending, state => {
      state.loading = true
    })
    builder.addCase(createConfig.fulfilled, state => {
      state.loading = false
      state.success = true
      state.error = ''
      state.createSuccess = true
    })
    builder.addCase(createConfig.rejected, (state, action) => {
      state.loading = false
      state.createSuccess = false
      state.error = action.payload
    })

    builder.addCase(retrieveConfig.pending, state => {
      state.loading = true
    })
    // : PayloadAction<[{ message:string; payload:[{id,key,value}] }]>
    builder.addCase(retrieveConfig.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = ''
      state.deleteSuccess = false
      state.createSuccess = false
      state.updateSuccess = false
      state.config = action.payload
    })
    builder.addCase(retrieveConfig.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    builder.addCase(SingleConfig.pending, state => {
      state.loading = true
    })
    builder.addCase(SingleConfig.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.sconfig = action.payload
    })
    builder.addCase(SingleConfig.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(updateConfig.pending, state => {
      state.loading = true
    })
    builder.addCase(updateConfig.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = ''
      state.updateSuccess = true
    })
    builder.addCase(updateConfig.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(searchConfig.pending, state => {
      state.loading = true
    })
    builder.addCase(searchConfig.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.deleteSuccess = false
      state.createSuccess = false
      state.updateSuccess = false
      state.config = action.payload
    })
    builder.addCase(searchConfig.rejected, state => {
      state.loading = false
      state.error = false
    })

    builder.addCase(deleteConfig.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteConfig.fulfilled, state => {
      state.loading = false
      state.success = true
      state.deleteSuccess = true
    })
    builder.addCase(deleteConfig.rejected, state => {
      state.loading = false
      state.error = false
    })
  },
})
const { reducer } = configSlice
export default reducer
