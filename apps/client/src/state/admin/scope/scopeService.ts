import axios from 'axios'
class ScopeService {
  getAll(currentPage = 1, page = 10) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/scope?per_page=${page}&page=${currentPage}`
    )
  }
  getOne(search) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/scope?search=${search}&field=tables`
    )
  }
  get(id) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/scope?id=${id}`
    )
  }
  create(data) {
    return axios.post(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/scope`,
      data
    )
  }
  update(id, data) {
    return axios.patch(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/scope?id=${id}`,
      data
    )
  }
  delete(id) {
    return axios.delete(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/scope?id=${id}`
    )
  }
}
export default new ScopeService()
