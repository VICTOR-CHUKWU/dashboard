import { ApiService } from "./api.service";

const accessService = {
  getAll: (limit?: any, page?: number) => {
    return new Promise(function (resolve, reject) {
      ApiService.get(
        `/admin/user/getAllUsers?currentPage=${page}&perPage=${limit}`
      )
        .then((res) => {
          if (res.status !== 200) {
            return reject(res.data);
          }
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  changeUserStatus: (data: any) => {
    return new Promise(function (resolve, reject) {
      console.log(data);
      ApiService.post(`/admin/user/updateStatus`, data)
        .then((res) => {
          if (!res.data.success) {
            return reject(res.data);
          }
          resolve(res.data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },
};

export { accessService };
