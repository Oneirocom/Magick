import axios from 'axios'
class ConfigService {
  getAll(currentPage = 1, page = 10) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/configuration?per_page=${page}&page=${currentPage}`
    )
  }
  getOne(search) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/configuration?search=${search}&field=key`
    )
  }
  get(id) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/configuration?id=${id}`
    )
  }
  create(data) {
    return axios.post(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/configuration`,
      data
    )
  }
  update(id, data) {
    return axios.patch(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/configuration?id=${id}`,
      data
    )
  }
  delete(id: number) {
    return axios.delete(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/configuration?id=${id}`
    )
  }
}
export default new ConfigService()
