import axios from 'axios'
class ClientService {
  getAll(currentPage = 1, page = 10) {
    return axios.get(
      `${
        import.meta.env.VITE_API_ROOT_URL
      }/setting/client?per_page=${page}&page=${currentPage}`
    )
  }
  getOne(search) {
    return axios.get(
      `${
        import.meta.env.VITE_API_ROOT_URL
      }/setting/client?search=${search}&field=client`
    )
  }
  get(id) {
    return axios.get(
      `${import.meta.env.VITE_API_ROOT_URL}/setting/client?id=${id}`
    )
  }
  create(data) {
    return axios.post(
      `${import.meta.env.VITE_API_ROOT_URL}/setting/client`,
      data
    )
  }
  update(id, data) {
    return axios.patch(
      `${import.meta.env.VITE_API_ROOT_URL}/setting/client?id=${id}`,
      data
    )
  }
  delete(id) {
    return axios.delete(
      `${import.meta.env.VITE_API_ROOT_URL}/setting/client?id=${id}`
    )
  }
}
export default new ClientService()
