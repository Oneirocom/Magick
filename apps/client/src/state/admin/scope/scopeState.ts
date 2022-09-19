import {
  createSlice,
  createAsyncThunk,
  // PayloadAction
} from '@reduxjs/toolkit'
import ScopeService from './scopeService'

export interface Scope {
  id: number
  full_table_size: string
  table_size: string
  tables: string
  record_count: string
}
export interface ScopeRes {
  message: String
  payload: {
    data: Scope[]
    pages: number
    totalItems: number
  }
}

export interface State {
  scope: ScopeRes
  siscope: { message: string; payload: {} }
  loading: boolean
  error: any
  success: boolean
  createSuccess: boolean
  updateSuccess: boolean
  deleteSuccess: boolean
}

const initialState: State = {
  scope: { message: '', payload: { data: [], pages: 0, totalItems: 0 } },
  siscope: { message: '', payload: [] },
  loading: false,
  error: '',
  success: false,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
}
export const createScope = createAsyncThunk(
  'createScope',
  async (data: {}, { rejectWithValue }) => {
    try {
      const res = await ScopeService.create(data)
      return res.data
    } catch (error) {
      throw rejectWithValue(error.response.data.message)
    }
  }
)
export const retrieveScope = createAsyncThunk(
  'getScope',
  async (data: { currentPage: number; page: number }) => {
    const res = await ScopeService.getAll(data.currentPage, data.page)
    return res.data
  }
)

export const singleScope = createAsyncThunk(
  'getsinglescope',
  async (id: number) => {
    const res = await ScopeService.get(id)
    return res.data
  }
)

export const searchScope = createAsyncThunk(
  'searchsinglescope',
  async (search: string) => {
    const res = await ScopeService.getOne(search)
    return res.data
  }
)

export const updateScope = createAsyncThunk(
  'updateScope',
  async (
    data: {
      id: number
      formData: {
        tables: string
        fullTableSize: {
          label: string
          value: string
        }
        tableSize: {
          label: string
          value: string
        }
        recordCount: string
      }
    },
    { rejectWithValue }
  ) => {
    const { id, formData } = data
    try {
      const res = await ScopeService.update(id, formData)
      return res.data
    } catch (error) {
      throw rejectWithValue(error.response.data.message)
    }
  }
)
export const deleteScope = createAsyncThunk(
  'deleteScope',
  async (id: number) => {
    const res = await ScopeService.delete(id)
    return res.data
  }
)

const scopeSlice = createSlice({
  name: 'scope',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createScope.pending, state => {
      state.loading = true
    })
    builder.addCase(createScope.fulfilled, state => {
      state.loading = false
      state.success = true
      state.createSuccess = true
    })
    builder.addCase(createScope.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(singleScope.pending, state => {
      state.loading = true
    })
    builder.addCase(singleScope.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.siscope = action.payload
    })
    builder.addCase(singleScope.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(updateScope.pending, state => {
      state.loading = true
    })
    builder.addCase(updateScope.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = ''
      state.updateSuccess = true
    })
    builder.addCase(updateScope.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(retrieveScope.pending, state => {
      state.loading = true
    })
    // : PayloadAction<[{ message:string; payload:[{id,key,value}] }]>
    builder.addCase(retrieveScope.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.error = ''
      state.deleteSuccess = false
      state.createSuccess = false
      state.updateSuccess = false
      state.scope = action.payload
    })
    builder.addCase(retrieveScope.rejected, state => {
      state.loading = false
      state.error = false
    })

    builder.addCase(searchScope.pending, state => {
      state.loading = true
    })
    builder.addCase(searchScope.fulfilled, (state, action) => {
      state.loading = false
      state.success = true
      state.deleteSuccess = false
      state.createSuccess = false
      state.updateSuccess = false
      state.scope = action.payload
    })
    builder.addCase(searchScope.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })

    builder.addCase(deleteScope.pending, state => {
      state.loading = true
    })
    builder.addCase(deleteScope.fulfilled, state => {
      state.loading = false
      state.success = true
      state.deleteSuccess = true
    })
    builder.addCase(deleteScope.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
  },
})
const { reducer } = scopeSlice
export default reducer
