import axios from 'axios'
class ClientService {
  getAll(currentPage = 1, page = 10) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/client?per_page=${page}&page=${currentPage}`
    )
  }
  getOne(search) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/client?search=${search}&field=client`
    )
  }
  get(id) {
    return axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/client?id=${id}`
    )
  }
  create(data) {
    return axios.post(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/client`,
      data
    )
  }
  update(id, data) {
    return axios.patch(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/client?id=${id}`,
      data
    )
  }
  delete(id) {
    return axios.delete(
      `${process.env.REACT_APP_API_ROOT_URL}/setting/client?id=${id}`
    )
  }
}
export default new ClientService()
