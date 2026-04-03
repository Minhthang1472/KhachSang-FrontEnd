import axiosClient from './axiosClient';

export const roomApi = {
  // Lấy danh sách phòng cần dọn
  getHousekeepingRooms: () => {
    return axiosClient.get('/Rooms/housekeeping');
  },

  // Cập nhật trạng thái dọn phòng (Dirty, Cleaning, Available, Maintenance)
  updateCleaningStatus: (id, status) => {
    // API C# [FromBody] string yêu cầu body phải là một chuỗi JSON hợp lệ (có ngoặc kép)
    return axiosClient.patch(
      `/Rooms/${id}/cleaning-status`, 
      JSON.stringify(status), 
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
};