import { ApiService } from "./api.service";

const userService = {
  createUser: (data: any) => {
    return new Promise(function (resolve, reject) {
      console.log(data);
      ApiService.post(`/auth/signUp`, data)
        .then((res) => {
          if (res.status !== 200) {
            return reject(res.data);
          }
          resolve(res.data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  },
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

  getAdmins: (limit?: any, page?: number) => {
    return new Promise(function (resolve, reject) {
      let url = `/admin/user/getUserByRole/admin?`;
      if (page) {
        url += `currentPage=${page}`;
      }
      if (limit) {
        url += `&perPage=${limit}`;
      }

      ApiService.get(url)
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

  getOthers: (limit?: any, page?: number) => {
    return new Promise(function (resolve, reject) {
      ApiService.get(
        `/admin/user/getUserByRole/other?currentPage=${page}&perPage=${limit}`
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

  getInstallers: (limit?: any, page?: number) => {
    return new Promise(function (resolve, reject) {
      ApiService.get(
        `/admin/user/getUserByRole/installer?currentPage=${page}&perPage=${limit}`
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

  getContractors: (limit?: any, page?: number) => {
    return new Promise(function (resolve, reject) {
      ApiService.get(
        `/admin/user/getUserByRole/contractor?currentPage=${page}&perPage=${limit}`
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
  getaudittrail: (limit?: any, page?: number) => {
    return new Promise(function (resolve, reject) {
      ApiService.get(
        `/admin/audittrail/getallaudittrails?currentPage=${page}&perPage=${limit}`
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

export { userService };
