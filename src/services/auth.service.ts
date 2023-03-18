import { ApiService } from "./api.service";

const authService = {
  login: (email: string, password: string) => {
    return new Promise(function (resolve, reject) {
      ApiService.post(`/auth/login`, {
        email: email,
        password: password,
      })
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
  resetPasswordIntial: (email: string) => {
    return new Promise(function (resolve, reject) {
      ApiService.post(`/auth/initiatePasswordReset`, {
        email: email
      })
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
  resetPasswordFinal: (email: string, token: string, password: string) => {
    return new Promise(function (resolve, reject) {
      ApiService.post(`/auth/finalizePasswordReset`, {
        email: email,
        token: token,
        password: password
      })
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
  changePassword: (data: any) => {
    return new Promise(function (resolve, reject) {
      ApiService.post(`/auth/changePassword`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        userId: data.userId,
      })
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
  toggleNotification: (data: any) => {
    return new Promise(function (resolve, reject) {
      ApiService.post(`/general/notification/toggleNotificatonStatus`, data)
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
  getStats: () => {
    return new Promise(function (resolve, reject) {
      ApiService.get(`/admin/dashboard`)
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
  getNotifications: (id: any) => {
    return new Promise(function (resolve, reject) {
      ApiService.get(`/general/notification/getAllUserNotifications/${id}`)
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
};

export { authService };
